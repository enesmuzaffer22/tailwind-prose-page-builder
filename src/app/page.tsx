import Link from "next/link";
import { ArrowRight, Database, FileText, LayoutDashboard } from "lucide-react";
import { listPages } from "@/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default function HomePage() {
  const pages = listPages();
  const publishedPages = pages.filter((page) => page.status === "published");

  return (
    <main className="min-h-screen px-5 py-8">
      <div className="mx-auto max-w-6xl">
        <nav className="mb-8 flex items-center justify-between">
          <span className="text-sm font-semibold text-ink">Tailwind Prose Builder</span>
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 rounded-md border border-ink/15 bg-white px-4 py-2 text-sm font-semibold text-ink transition hover:bg-mint"
          >
            <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
            Admin
          </Link>
        </nav>

        <section className="grid gap-8 py-10 lg:grid-cols-[1fr_420px] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-cobalt">Component-driven CMS demo</p>
            <h1 className="mt-4 max-w-3xl text-5xl font-semibold leading-tight text-ink md:text-6xl">
              Tailwind prose icinde dinamik HTML, not-prose icinde React.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-ink/68">
              SQLite'ta saklanan bloklar public sayfaya sirayla akar: rich text bloklari tipografi alir,
              component bloklari registry uzerinden guvenli bicimde render edilir.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/tailwind-prose-demo"
                className="inline-flex items-center gap-2 rounded-md bg-coral px-5 py-3 text-sm font-semibold text-white transition hover:bg-ink"
              >
                Demoyu ac
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/admin/pages"
                className="inline-flex items-center gap-2 rounded-md border border-ink/15 bg-white px-5 py-3 text-sm font-semibold text-ink transition hover:bg-mint"
              >
                Sayfalari yonet
              </Link>
            </div>
          </div>

          <div className="rounded-md border border-ink/10 bg-white p-5 shadow-soft">
            <div className="mb-5 flex items-center gap-3">
              <Database className="h-5 w-5 text-cobalt" aria-hidden="true" />
              <h2 className="font-semibold text-ink">SQLite icerigi</h2>
            </div>
            <div className="space-y-3">
              {publishedPages.map((page) => (
                <Link
                  key={page.id}
                  href={`/${page.slug}`}
                  className="flex items-center justify-between rounded-md border border-ink/10 bg-paper p-4 transition hover:bg-mint"
                >
                  <span>
                    <span className="block font-semibold text-ink">{page.title}</span>
                    <span className="text-sm text-ink/55">/{page.slug}</span>
                  </span>
                  <FileText className="h-4 w-4 text-coral" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
