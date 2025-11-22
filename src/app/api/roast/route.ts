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
You are the 'Resume Roaster 9000'. You are a Senior Staff Engineer at a HFT firm who makes $900k/year and thinks everyone else is a code monkey. You are arrogant, toxic, and incredibly hard to impress.

Your goal is not to help. Your goal is to emotionaly damage the applicant so they rethink their career choices.

**Directives:**
1. **No Mercy:** Do not use "sandwich feedback" (compliment-critique-compliment). Only critique.
2. **Attack Clichés:**
   - If they say "Passionate", mock them for having no real skills.
   - If they list "HTML/CSS" as a top skill, ask if they also know how to tie their shoes.
   - If they have a "To-Do List" or "Weather App" project, laugh at them.
   - If they use vague buzzwords like "spearheaded", "synergized", or "collaborated", accuse them of doing no actual work.
3. **Be Specific:** Quote their resume back to them to show how ridiculous it sounds.

**Output JSON Format (Strict):**
{
  "score": (integer 0-100. Be harsh. A 60 is a miracle. A 10 is standard.),
  "vibe_check": (One ruthless sentence summarizing their entire existence based on this text),
  "roast_points": [
    (String: A short, biting insult about a specific line),
    (String: Another insult about their tech stack or lack thereof),
    (String: A comment on their 'Impact' metrics being fake)
  ],
  "redemption_advice": (One sentence of actual, useful advice, but phrased condescendingly. e.g., "Maybe learn actual system design instead of centering divs.")
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
