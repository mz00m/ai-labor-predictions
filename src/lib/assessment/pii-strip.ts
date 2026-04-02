// PII detection and stripping for assessment file processing
// Runs in-memory only — no file content is persisted

const PII_PATTERNS: { pattern: RegExp; replacement: string; label: string }[] = [
  // SSN
  { pattern: /\b\d{3}-\d{2}-\d{4}\b/g, replacement: "[SSN REDACTED]", label: "SSN" },
  // Email addresses
  { pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, replacement: "[EMAIL REDACTED]", label: "Email" },
  // Phone numbers (various formats)
  { pattern: /\b(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g, replacement: "[PHONE REDACTED]", label: "Phone" },
  // Credit card numbers
  { pattern: /\b(?:\d{4}[-\s]?){3}\d{4}\b/g, replacement: "[CARD REDACTED]", label: "Credit Card" },
  // EIN (Employer ID)
  { pattern: /\b\d{2}-\d{7}\b/g, replacement: "[EIN REDACTED]", label: "EIN" },
  // Date of birth patterns (MM/DD/YYYY, MM-DD-YYYY)
  { pattern: /\b(?:0[1-9]|1[0-2])[\/\-](?:0[1-9]|[12]\d|3[01])[\/\-](?:19|20)\d{2}\b/g, replacement: "[DOB REDACTED]", label: "Date of Birth" },
  // Bank account numbers (generic long number sequences in financial context)
  { pattern: /\b(?:account|acct|routing)[\s#:]*\d{6,17}\b/gi, replacement: "[ACCOUNT REDACTED]", label: "Bank Account" },
  // IP addresses
  { pattern: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g, replacement: "[IP REDACTED]", label: "IP Address" },
  // Street addresses (basic pattern)
  { pattern: /\b\d{1,5}\s+(?:[A-Z][a-z]+\s+){1,3}(?:St|Street|Ave|Avenue|Blvd|Boulevard|Dr|Drive|Ln|Lane|Rd|Road|Way|Ct|Court|Pl|Place)\.?\b/gi, replacement: "[ADDRESS REDACTED]", label: "Address" },
];

// Names of people often appear in org documents — we flag but don't auto-strip
// since they may be role titles. The AI analysis step handles this contextually.

export interface PiiScanResult {
  cleanedText: string;
  redactedCount: number;
  redactedTypes: string[];
}

/**
 * Strip PII from text content before AI analysis.
 * Operates entirely in-memory — no content is persisted.
 */
export function stripPii(text: string): PiiScanResult {
  let cleanedText = text;
  const redactedTypes = new Set<string>();
  let redactedCount = 0;

  for (const { pattern, replacement, label } of PII_PATTERNS) {
    const matches = cleanedText.match(pattern);
    if (matches) {
      redactedCount += matches.length;
      redactedTypes.add(label);
      cleanedText = cleanedText.replace(pattern, replacement);
    }
  }

  return {
    cleanedText,
    redactedCount,
    redactedTypes: Array.from(redactedTypes),
  };
}

/**
 * Check if text contains potential PII without stripping.
 * Useful for client-side warnings.
 */
export function detectPii(text: string): { hasPii: boolean; types: string[] } {
  const types: string[] = [];

  for (const { pattern, label } of PII_PATTERNS) {
    // Reset regex state
    pattern.lastIndex = 0;
    if (pattern.test(text)) {
      types.push(label);
    }
  }

  return { hasPii: types.length > 0, types };
}
