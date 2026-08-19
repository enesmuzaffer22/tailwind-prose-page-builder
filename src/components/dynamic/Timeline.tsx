export type TimelineProps = {
  title: string;
  items: {
    date: string;
    title: string;
    description: string;
  }[];
};

export function Timeline({ title, items }: TimelineProps) {
  return (
    <section className="my-10 rounded-md border border-ink/10 bg-white p-6 shadow-soft">
      <h2 className="text-2xl font-semibold text-ink">{title}</h2>
      <ol className="mt-6 space-y-5">
        {items.map((item) => (
          <li key={`${item.date}-${item.title}`} className="grid gap-3 sm:grid-cols-[120px_1fr]">
            <time className="text-sm font-semibold text-cobalt">{item.date}</time>
            <div className="border-l-2 border-mint pl-4">
              <h3 className="font-semibold text-ink">{item.title}</h3>
              <p className="mt-1 text-sm leading-6 text-ink/64">{item.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
