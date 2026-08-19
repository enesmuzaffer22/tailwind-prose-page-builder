import Link from "next/link";
import { ArrowRight, FileText, Layers3, Radio, ScrollText } from "lucide-react";
import { getDashboardStats } from "@/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default function AdminDashboardPage() {
  const stats = getDashboardStats();
  const cards = [
    { label: "Toplam Sayfa", value: stats.total, icon: FileText },
    { label: "Yayinda", value: stats.published, icon: Radio },
    { label: "Taslak", value: stats.draft, icon: ScrollText },
  ];

  return (
    <main className="mx-auto max-w-6xl px-5 py-8">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-cobalt">Admin Dashboard</p>
          <h1 className="mt-1 text-3xl font-semibold text-ink">Icerik merkezi</h1>
        </div>
        <Link
          href="/admin/pages"
          className="inline-flex items-center gap-2 rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-cobalt"
        >
          Sayfalari ac
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="rounded-md border border-ink/10 bg-white p-5 shadow-sm">
              <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-md bg-mint text-cobalt">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <strong className="text-3xl text-ink">{card.value}</strong>
              <span className="mt-1 block text-sm text-ink/58">{card.label}</span>
            </div>
          );
        })}
      </section>

      <section className="mt-6 rounded-md border border-ink/10 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <Layers3 className="h-5 w-5 text-coral" aria-hidden="true" />
          <h2 className="font-semibold text-ink">Son duzenlenen sayfalar</h2>
        </div>
        <div className="divide-y divide-ink/10">
          {stats.recent.map((page) => (
            <Link
              key={page.id}
              href={`/admin/pages/${page.id}`}
              className="flex items-center justify-between py-3 text-sm transition hover:text-cobalt"
            >
              <span className="font-medium">{page.title}</span>
              <span className="text-ink/52">/{page.slug}</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
