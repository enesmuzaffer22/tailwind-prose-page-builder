"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

export type FaqAccordionProps = {
  title: string;
  items: {
    question: string;
    answer: string;
  }[];
};

export function FaqAccordion({ title, items }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="my-10 rounded-md border border-ink/10 bg-white p-6 shadow-soft">
      <h2 className="text-2xl font-semibold text-ink">{title}</h2>
      <div className="mt-5 divide-y divide-ink/10">
        {items.map((item, index) => {
          const isOpen = index === openIndex;

          return (
            <div key={item.question} className="py-3">
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
                className="flex w-full items-center justify-between gap-4 text-left"
              >
                <span className="font-semibold text-ink">{item.question}</span>
                <ChevronDown
                  className={`h-4 w-4 flex-none text-cobalt transition ${isOpen ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </button>
              {isOpen ? <p className="mt-3 text-sm leading-6 text-ink/64">{item.answer}</p> : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
