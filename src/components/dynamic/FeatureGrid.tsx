import { CheckCircle2 } from "lucide-react";

export type FeatureGridProps = {
  eyebrow?: string;
  title: string;
  items: {
    title: string;
    description: string;
  }[];
};

export function FeatureGrid({ eyebrow, title, items }: FeatureGridProps) {
  return (
    <section className="my-10 rounded-md border border-ink/10 bg-white p-6 shadow-soft">
      {eyebrow ? <p className="text-xs font-semibold uppercase tracking-wider text-cobalt">{eyebrow}</p> : null}
      <h2 className="mt-2 text-2xl font-semibold text-ink">{title}</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item.title} className="rounded-md border border-ink/10 bg-paper p-4">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-md bg-mint text-cobalt">
              <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
            </div>
            <h3 className="text-base font-semibold text-ink">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-ink/64">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
