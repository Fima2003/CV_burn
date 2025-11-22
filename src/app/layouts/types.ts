import { type DragEvent, type MutableRefObject } from 'react';
import type { RoastResult } from '../../types/roast';

export interface DeviceLayoutProps {
  resumeInput: string;
  resumeFile: File | null;
  dragActive: boolean;
  loading: boolean;
  result: RoastResult | null;
  error: string;
  copied: boolean;
  scoreAccent: string;
  supportedFileText: string;
  fileInputRef: MutableRefObject<HTMLInputElement | null>;
  onFileSelection: (file: File | null) => void;
  onDrop: (event: DragEvent<HTMLDivElement>) => void;
  onResumeInputChange: (value: string) => void;
  onRoast: () => void | Promise<void>;
  onCopy: (text: string) => void;
  setDragActive: (value: boolean) => void;
}
