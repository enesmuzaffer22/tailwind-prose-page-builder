import { ArrowRight } from "lucide-react";

export type CallToActionProps = {
  title: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
};

export function CallToAction({ title, description, buttonText, buttonUrl }: CallToActionProps) {
  return (
    <section className="my-10 rounded-md border border-ink/10 bg-ink p-6 text-white shadow-soft">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/72">{description}</p>
        </div>
        <a
          href={buttonUrl}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-saffron px-4 py-2 text-sm font-semibold text-ink transition hover:bg-white"
        >
          {buttonText}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
