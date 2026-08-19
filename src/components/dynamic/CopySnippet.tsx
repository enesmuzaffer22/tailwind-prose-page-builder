"use client";

import { Check, Clipboard } from "lucide-react";
import { useState } from "react";

export type CopySnippetProps = {
  title: string;
  textToCopy: string;
  buttonText: string;
  successMessage: string;
};

export function CopySnippet({ title, textToCopy, buttonText, successMessage }: CopySnippetProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(textToCopy);
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = textToCopy;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }

    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section className="my-10 rounded-md border border-ink/10 bg-ink p-6 text-white shadow-soft">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-semibold">{title}</h2>
          <pre className="mt-4 overflow-x-auto rounded-md bg-white/10 p-4 text-sm text-white/90">
            <code>{textToCopy}</code>
          </pre>
        </div>
        <button
          type="button"
          onClick={copy}
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-md bg-saffron px-4 text-sm font-semibold text-ink transition hover:bg-white"
        >
          {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Clipboard className="h-4 w-4" aria-hidden="true" />}
          {copied ? successMessage : buttonText}
        </button>
      </div>
    </section>
  );
}
