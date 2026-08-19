import { Quote } from "lucide-react";

export type TestimonialProps = {
  quote: string;
  author: string;
  role: string;
  company?: string;
};

export function Testimonial({ quote, author, role, company }: TestimonialProps) {
  return (
    <figure className="my-10 rounded-md border border-coral/20 bg-coral/10 p-6 shadow-sm">
      <Quote className="h-7 w-7 text-coral" aria-hidden="true" />
      <blockquote className="mt-4 text-xl font-medium leading-8 text-ink">{quote}</blockquote>
      <figcaption className="mt-5 border-t border-ink/10 pt-4">
        <strong className="block text-sm text-ink">{author}</strong>
        <span className="text-sm text-ink/60">
          {role}
          {company ? `, ${company}` : ""}
        </span>
      </figcaption>
    </figure>
  );
}
