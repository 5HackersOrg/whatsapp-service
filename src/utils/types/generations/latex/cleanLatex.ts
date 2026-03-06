export const cleanLatex = (rawResume: string) => {
  // 1. Remove outer quotes if they exist
  let cleaned = rawResume.trim();
  if (cleaned.includes("```")) {
    const index = cleaned.indexOf("```") + 8;
    cleaned = cleaned.substring(index);
    const end = cleaned.indexOf("```");
    cleaned = cleaned.substring(0, end).trim();
  }
  if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
    cleaned = cleaned.slice(1, -1);
  }

  // 1. Replace Markdown-style bold (e.g. **text**) → \textbf{text}
  cleaned = cleaned.replace(/\*\*(.+?)\*\*/g, "\\textbf{$1}");

  // 2. Replace markdown-style italic (*text*) → \textit{text}, safely (ignore math)
  cleaned = cleaned.replace(
    /(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g,
    "\\textit{$1}",
  );

  // 3. Fix common typos like ewcommand, rennewcommand, etc.
  cleaned = cleaned.replace(/\b(ewcommand)\b/g, "\\newcommand");
  cleaned = cleaned.replace(/\b(rennewcommand)\b/g, "\\renewcommand");

  // 👇 The fix: Use a single step to replace all literal and escaped newlines with a space or empty string
  // To remove ALL newlines, replace both '\n' and its JSON-escaped version '\\n' with an empty string.

  return cleaned;
};
