'use client';

import { type DragEvent, useEffect, useRef, useState } from 'react';
import type { RoastResult } from '../types/roast';
import type { DeviceLayoutProps } from './layouts/types';
import ComputerLayout from './layouts/computer';
import PhoneLayout from './layouts/phone';
import TabletLayout from './layouts/tablet';

const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024;
const SUPPORTED_FILE_TEXT = '.pdf, .txt, .md (max 2MB)';

export default function Home() {
  const [resumeInput, setResumeInput] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RoastResult | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [device, setDevice] = useState<'phone' | 'tablet' | 'computer'>('computer');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const determineDevice = () => {
      if (typeof window === 'undefined') {
        return 'computer' as const;
      }
      const width = window.innerWidth;
      if (width >= 1280) {
        return 'computer' as const;
      }
      if (width >= 768) {
        return 'tablet' as const;
      }
      return 'phone' as const;
    };

    const update = () => setDevice(determineDevice());
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const handleFileSelection = (file: File | null) => {
    if (loading) {
      return;
    }

    if (!file) {
      setResumeFile(null);
      return;
    }

    const extension = file.name.split('.').pop()?.toLowerCase();
    const isPdf = file.type === 'application/pdf' || extension === 'pdf';
    const isPlainText = file.type.startsWith('text/') || ['txt', 'md', 'markdown'].includes(extension || '');

    if (!isPdf && !isPlainText) {
      setError('Upload a PDF or plain text file. No, PowerPoints do not count.');
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError('Keep it under 2MB. Resumes, not novels.');
      return;
    }

    setError('');
    setResumeFile(file);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
      handleFileSelection(file);
    }
  };

  const handleRoast = async () => {
    if (!resumeFile && !resumeInput.trim()) {
      setError("Paste something or upload a file. I can't roast thin air.");
      return;
    }

    setError('');
    setLoading(true);
    setResult(null);
    setCopied(false);

    try {
      const formData = new FormData();
      formData.append('resumeText', resumeInput.trim());
      if (resumeFile) {
        formData.append('resumeFile', resumeFile);
      }

      const response = await fetch('/api/roast', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to roast resume' }));
        throw new Error(errorData.error || 'Failed to roast resume');
      }

      const data: RoastResult = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred. Even the AI gave up.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scoreAccent = result ? (result.score >= 75 ? 'text-emerald-400' : result.score >= 45 ? 'text-amber-300' : 'text-red-500') : 'text-red-500';

  const layoutProps: DeviceLayoutProps = {
    resumeInput,
    resumeFile,
    dragActive,
    loading,
    result,
    error,
    copied,
    scoreAccent,
    supportedFileText: SUPPORTED_FILE_TEXT,
    fileInputRef,
    onFileSelection: handleFileSelection,
    onDrop: handleDrop,
    onResumeInputChange: (value: string) => setResumeInput(value),
    onRoast: handleRoast,
    onCopy: copyToClipboard,
    setDragActive,
  };

  const DeviceComponent = device === 'computer' ? ComputerLayout : device === 'tablet' ? TabletLayout : PhoneLayout;

  return <DeviceComponent {...layoutProps} />;
}
