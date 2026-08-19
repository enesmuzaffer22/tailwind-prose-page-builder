export type ComparisonTableProps = {
  title: string;
  columns: string[];
  rows: {
    label: string;
    values: string[];
  }[];
};

export function ComparisonTable({ title, columns, rows }: ComparisonTableProps) {
  return (
    <section className="my-10 overflow-hidden rounded-md border border-ink/10 bg-white shadow-soft">
      <div className="border-b border-ink/10 bg-paper px-5 py-4">
        <h2 className="text-xl font-semibold text-ink">{title}</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <thead>
            <tr className="bg-white">
              <th className="border-b border-ink/10 px-4 py-3 text-left font-semibold text-ink">Ozellik</th>
              {columns.map((column) => (
                <th key={column} className="border-b border-ink/10 px-4 py-3 text-left font-semibold text-cobalt">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="odd:bg-paper/70">
                <td className="border-b border-ink/10 px-4 py-3 font-medium text-ink">{row.label}</td>
                {columns.map((column, index) => (
                  <td key={`${row.label}-${column}`} className="border-b border-ink/10 px-4 py-3 text-ink/66">
                    {row.values[index] ?? "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
