"use client";

import { MousePointerClick } from "lucide-react";
import { useState } from "react";

export type ChoicePollProps = {
  title: string;
  description?: string;
  options: string[];
};

export function ChoicePoll({ title, description, options }: ChoicePollProps) {
  const [selected, setSelected] = useState("");

  return (
    <section className="my-10 rounded-md border border-ink/10 bg-white p-6 shadow-soft">
      <div className="flex gap-4">
        <div className="flex h-11 w-11 flex-none items-center justify-center rounded-md bg-mint text-cobalt">
          <MousePointerClick className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-semibold text-ink">{title}</h2>
          {description ? <p className="mt-2 text-sm leading-6 text-ink/64">{description}</p> : null}

          <div className="mt-5 flex flex-wrap gap-2">
            {options.map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={selected === option}
                onClick={() => setSelected(option)}
                className={`rounded-md border px-4 py-2 text-sm font-semibold transition ${
                  selected === option
                    ? "border-cobalt bg-cobalt text-white"
                    : "border-ink/15 bg-paper text-ink hover:bg-mint"
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          {selected ? (
            <p className="mt-4 rounded-md bg-blue-50 px-3 py-2 text-sm font-medium text-cobalt">
              Seciminiz: {selected}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
