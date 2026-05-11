"use client";

import { useState, useRef, useCallback } from "react";
import { FileCategory, FILE_CATEGORY_LABELS, UploadedFileMeta } from "@/lib/assessment/types";

interface FileEntry {
  file: File;
  meta: UploadedFileMeta;
}

interface FileUploaderProps {
  files: FileEntry[];
  onFilesChange: (files: FileEntry[]) => void;
  maxFiles?: number;
  maxSizeMb?: number;
  maxTotalSizeMb?: number;
}

const ACCEPTED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "text/csv",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

const ACCEPTED_EXTENSIONS = ".pdf,.doc,.docx,.txt,.csv,.xls,.xlsx";

export default function FileUploader({
  files,
  onFilesChange,
  maxFiles = 10,
  // 10MB matches the server-side MAX_FILE_SIZE in /api/assessment/analyze.
  // The previous 25MB default let users upload files that the server
  // silently dropped — they'd never know their PDF wasn't used.
  maxSizeMb = 10,
  // Total combined size across all attached files. Vercel Lambda memory
  // is bounded, and pdf-parse on the server processes files sequentially,
  // so 30MB is a safe ceiling that fits ~6 typical handbooks.
  maxTotalSizeMb = 30,
}: FileUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (newFiles: FileList) => {
      setError(null);
      const entries: FileEntry[] = [];
      let runningTotal = files.reduce((sum, f) => sum + f.meta.size, 0);
      const totalCap = maxTotalSizeMb * 1024 * 1024;

      for (let i = 0; i < newFiles.length; i++) {
        const file = newFiles[i];

        if (!ACCEPTED_TYPES.includes(file.type) && !file.name.match(/\.(pdf|docx?|txt|csv|xlsx?)$/i)) {
          setError(`"${file.name}" is not a supported file type. Use PDF, DOCX, TXT, CSV, or XLS.`);
          continue;
        }

        if (file.size > maxSizeMb * 1024 * 1024) {
          setError(`"${file.name}" is ${(file.size / 1024 / 1024).toFixed(1)}MB — exceeds the ${maxSizeMb}MB per-file limit.`);
          continue;
        }

        if (runningTotal + file.size > totalCap) {
          setError(`Adding "${file.name}" would exceed the ${maxTotalSizeMb}MB combined upload limit. Remove some files first or upload your most important documents only.`);
          continue;
        }

        if (files.length + entries.length >= maxFiles) {
          setError(`Maximum ${maxFiles} files allowed.`);
          break;
        }

        runningTotal += file.size;
        entries.push({
          file,
          meta: {
            name: file.name,
            type: file.type,
            size: file.size,
            category: guessCategory(file.name),
            uploadedAt: new Date().toISOString(),
          },
        });
      }

      if (entries.length > 0) {
        onFilesChange([...files, ...entries]);
      }
    },
    [files, onFilesChange, maxFiles, maxSizeMb, maxTotalSizeMb]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      if (e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles]
  );

  const removeFile = (index: number) => {
    const updated = [...files];
    updated.splice(index, 1);
    onFilesChange(updated);
  };

  const updateCategory = (index: number, category: FileCategory) => {
    const updated = [...files];
    updated[index] = {
      ...updated[index],
      meta: { ...updated[index].meta, category },
    };
    onFilesChange(updated);
  };

  return (
    <div>
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`
          relative cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-colors
          ${dragActive
            ? "border-accent bg-accent/[0.04]"
            : "border-gray-200 hover:border-gray-300 bg-gray-50"
          }
        `}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPTED_EXTENSIONS}
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="hidden"
        />

        <svg className="w-8 h-8 mx-auto mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
        </svg>

        <p className="text-md text-gray-500 mb-1">
          <span className="text-accent font-medium">Click to upload</span> or drag and drop
        </p>
        <p className="text-sm text-gray-400">
          PDF, DOCX, TXT, CSV, XLS up to {maxSizeMb}MB each &middot; {maxFiles} files max
        </p>
      </div>

      {error && (
        <p className="mt-2 text-base text-red-500">{error}</p>
      )}

      {/* File list */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((entry, index) => (
            <div
              key={`${entry.meta.name}-${index}`}
              className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-lg px-4 py-3"
            >
              <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>

              <div className="flex-1 min-w-0">
                <p className="text-base text-gray-900 truncate">{entry.meta.name}</p>
                <p className="text-xs text-gray-400">{formatFileSize(entry.meta.size)}</p>
              </div>

              <select
                value={entry.meta.category}
                onChange={(e) => updateCategory(index, e.target.value as FileCategory)}
                className="text-sm bg-white border border-gray-200 rounded px-2 py-1 text-gray-500 appearance-none cursor-pointer"
              >
                {(Object.entries(FILE_CATEGORY_LABELS) as [FileCategory, string][]).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>

              <button
                onClick={() => removeFile(index)}
                className="text-gray-400 hover:text-red-500 transition-colors p-1"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Security note */}
      <div className="mt-3 flex gap-2 items-start">
        <svg className="w-3.5 h-3.5 text-accent flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
        <p className="text-xs text-gray-400">
          Files are processed in-memory only. Content is analyzed once, PII is stripped,
          and no file data is stored on our servers. Only the sanitized analysis output is saved.
        </p>
      </div>
    </div>
  );
}

function guessCategory(filename: string): FileCategory {
  const lower = filename.toLowerCase();
  if (lower.includes("job") || lower.includes("jd") || lower.includes("position") || lower.includes("role")) return "job-description";
  if (lower.includes("handbook") || lower.includes("employee")) return "employee-handbook";
  if (lower.includes("org") && lower.includes("chart")) return "org-chart";
  if (lower.includes("process") || lower.includes("sop") || lower.includes("procedure")) return "process-document";
  if (lower.includes("orient") || lower.includes("onboard")) return "orientation-guide";
  if (lower.includes("market") || lower.includes("brand")) return "marketing-material";
  if (lower.includes("financ") || lower.includes("budget") || lower.includes("p&l")) return "financial-report";
  return "other";
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export type { FileEntry };
