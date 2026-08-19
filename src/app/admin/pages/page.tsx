import Link from "next/link";
import { Eye, Pencil, Plus } from "lucide-react";
import { deletePageAction } from "@/app/actions";
import { DeletePageButton } from "@/components/admin/DeletePageButton";
import { listPages } from "@/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default function AdminPagesPage() {
  const pages = listPages();

  return (
    <main className="mx-auto max-w-6xl px-5 py-8">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-cobalt">Sayfalar</p>
          <h1 className="mt-1 text-3xl font-semibold text-ink">Page builder kayitlari</h1>
        </div>
        <Link
          href="/admin/pages/new"
          className="inline-flex items-center gap-2 rounded-md bg-coral px-4 py-2 text-sm font-semibold text-white transition hover:bg-ink"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Yeni sayfa
        </Link>
      </div>

      <section className="overflow-hidden rounded-md border border-ink/10 bg-white shadow-sm">
        <div className="grid grid-cols-[1.2fr_1fr_120px_150px] gap-4 border-b border-ink/10 bg-paper px-4 py-3 text-xs font-semibold uppercase tracking-wider text-ink/55">
          <span>Sayfa</span>
          <span>Slug</span>
          <span>Durum</span>
          <span className="text-right">Actions</span>
        </div>
        <div className="divide-y divide-ink/10">
          {pages.map((page) => (
            <div key={page.id} className="grid grid-cols-[1.2fr_1fr_120px_150px] items-center gap-4 px-4 py-3">
              <span className="font-medium text-ink">{page.title}</span>
              <span className="truncate text-sm text-ink/58">/{page.slug}</span>
              <span className="text-sm capitalize text-ink/70">{page.status}</span>
              <div className="flex justify-end gap-2">
                <Link
                  href={`/admin/pages/${page.id}`}
                  title="Duzenle"
                  aria-label="Sayfayi duzenle"
                  className="grid h-9 w-9 place-items-center rounded-md border border-ink/15 text-ink transition hover:bg-mint"
                >
                  <Pencil className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  href={`/${page.slug}?preview=1`}
                  title="Onizle"
                  aria-label="Sayfayi onizle"
                  className="grid h-9 w-9 place-items-center rounded-md border border-ink/15 text-ink transition hover:bg-mint"
                >
                  <Eye className="h-4 w-4" aria-hidden="true" />
                </Link>
                <DeletePageButton action={deletePageAction} id={page.id} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
