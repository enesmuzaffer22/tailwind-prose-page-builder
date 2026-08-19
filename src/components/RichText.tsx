import { sanitizeRichText } from "@/lib/sanitize-html";

export function RichText({ html }: { html: string }) {
  return <div dangerouslySetInnerHTML={{ __html: sanitizeRichText(html) }} />;
}
