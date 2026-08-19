export type StatsProps = {
  items: {
    label: string;
    value: string;
  }[];
};

export function Stats({ items }: StatsProps) {
  return (
    <section className="my-10 grid gap-3 sm:grid-cols-3">
      {items.map((item) => (
        <div key={`${item.label}-${item.value}`} className="rounded-md border border-ink/10 bg-white p-5 shadow-sm">
          <strong className="block text-3xl text-cobalt">{item.value}</strong>
          <span className="mt-1 block text-sm text-ink/64">{item.label}</span>
        </div>
      ))}
    </section>
  );
}
