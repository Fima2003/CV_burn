import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

interface RoastResponse {
    score: number;
    vibe_check: string;
    roast_points: string[];
    redemption_advice: string;
}

interface ResumePayload {
    text: string;
    file: File | null;
}

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'nodejs';

const MAX_FILE_BYTES = 2 * 1024 * 1024; // 2MB limit for uploads

class ClientError extends Error {
    constructor(message: string, public status = 400) {
        super(message);
        this.name = 'ClientError';
    }
}

export async function POST(request: NextRequest) {
    let uploadedFileId: string | null = null;

    try {
        const payload = await getResumePayload(request);

        if (!payload.text && !payload.file) {
            throw new ClientError('Please paste your resume text or upload a supported file.');
        }

        if (payload.file) {
            validateFile(payload.file);
            const uploadedFile = await client.files.create({
                file: payload.file,
                purpose: 'user_data',
            });
            uploadedFileId = uploadedFile.id;
        }

        const systemPrompt = `
You are the Roastmaster General at the 'Comedy Central Roast of [Applicant Name]'. 
You are a vicious, quick-witted stand-up comedian. The crowd is drunk, and you are here to destroy.

**The Vibe:**
- High energy. Insulting. Shocking.
- You are NOT analyzing a document. You are heckling a human being.
- Use the phrase "Look at this..." or "Folks, listen to this..."
- Treat every bullet point on the resume as a setup for a punchline.

**Directives:**
1. **The Opener:** Start by insulting their overall vibe. (e.g., "Wow, I haven't seen a resume this desperate since I dated a stripper.")
2. **The Material:**
   - If they went to a Bootcamp: "Oh, you did a 6-week bootcamp? I'm sure that qualifies you to fly the space shuttle."
   - If they have a gap in employment: "There's a 2-year gap here... were you in prison or just 'finding yourself' in your mom's basement?"
   - If they list 'Communication' as a skill: "You listed 'Communication'? Based on this formatting, you can't even communicate with a printer."
3. **No Mercy:** Don't be constructive. Be funny. Be mean.

**Output JSON (Strict):**
{
  "score": (integer 0-100. Low scores are funnier.),
  "vibe_check": (Your opening monologue joke. Make it hurt.),
  "roast_points": [
    (String: A punchline about their education),
    (String: A punchline about their 'skills'),
    (String: A punchline about a specific project or their lack of experience)
  ],
  "redemption_advice": (The closer. A final 'get off the stage' insult disguised as advice. e.g., "My advice? Learn to weld.")
}
`;

        const userContent: Array<
            | { type: 'file'; file: { file_id: string } }
            | { type: 'text'; text: string }
        > = [];

        if (uploadedFileId) {
            userContent.push({ type: 'file', file: { file_id: uploadedFileId } });
        }

        if (payload.text) {
            userContent.push({
                type: 'text',
                text: `Roast this resume:

${payload.text}`,
            });
        } else {
            userContent.push({
                type: 'text',
                text: 'Roast the uploaded resume file and respond with the required JSON schema.',
            });
        }

        const response = await client.chat.completions.create({
            model: 'gpt-4o-mini',
            max_tokens: 1024,
            messages: [
                {
                    role: 'system',
                    content: systemPrompt,
                },
                {
                    role: 'user',
                    content: userContent,
                },
            ],
        });

        // Extract the text content from the response
        const responseText = response.choices[0]?.message?.content || '';

        // Parse the JSON response
        let roastData: RoastResponse;
        try {
            // Try to extract JSON from the response (in case there's extra text)
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                roastData = JSON.parse(jsonMatch[0]);
            } else {
                roastData = JSON.parse(responseText);
            }
        } catch {
            console.error('Failed to parse AI response:', responseText);
            return NextResponse.json(
                { error: 'Failed to parse AI response' },
                { status: 500 }
            );
        }

        // Validate the response structure
        if (
            typeof roastData.score !== 'number' ||
            typeof roastData.vibe_check !== 'string' ||
            !Array.isArray(roastData.roast_points) ||
            typeof roastData.redemption_advice !== 'string'
        ) {
            return NextResponse.json(
                { error: 'Invalid response structure from AI' },
                { status: 500 }
            );
        }

        return NextResponse.json(roastData);
    } catch (error) {
        console.error('Error in roast API:', error);

        if (error instanceof ClientError) {
            return NextResponse.json({ error: error.message }, { status: error.status });
        }

        if (error instanceof Error && error.message.includes('API key')) {
            return NextResponse.json(
                { error: 'OpenAI API key is not configured' },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to roast resume. Please try again.' },
            { status: 500 }
        );
    } finally {
        if (uploadedFileId) {
            // best-effort cleanup so we do not accumulate temp files
            void client.files.delete(uploadedFileId).catch((cleanupError: unknown) => {
                console.error('Failed to delete uploaded file', cleanupError);
            });
        }
    }
}

async function getResumePayload(request: NextRequest): Promise<ResumePayload> {
    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
        const formData = await request.formData();
        const textField = (formData.get('resumeText') as string | null)?.toString().trim() ?? '';
        const fileField = formData.get('resumeFile');

        return {
            text: textField,
            file: fileField instanceof File ? fileField : null,
        };
    }

    const jsonBody = await safeJson(request);
    const text = typeof jsonBody?.resumeText === 'string' ? jsonBody.resumeText.trim() : '';

    if (!text) {
        throw new ClientError('Resume text is required and cannot be empty.');
    }

    return { text, file: null };
}

async function safeJson(request: NextRequest) {
    try {
        return await request.json();
    } catch {
        return null;
    }
}

function validateFile(file: File) {
    if (file.size > MAX_FILE_BYTES) {
        throw new ClientError('Resume file is too large. Keep it under 2MB.');
    }

    const extension = file.name.split('.').pop()?.toLowerCase();
    const isPdf = file.type === 'application/pdf' || extension === 'pdf';
    const isPlainText = file.type.startsWith('text/') || ['txt', 'md', 'markdown'].includes(extension || '');

    if (!isPdf && !isPlainText) {
        throw new ClientError('Unsupported file type. Upload a PDF or plain text file.');
    }
}
