import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import { createPageAction } from "@/app/actions";

export const runtime = "nodejs";

export default function NewPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-8">
      <Link href="/admin/pages" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-ink/70 hover:text-ink">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Sayfalar
      </Link>

      <section className="rounded-md border border-ink/10 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wider text-cobalt">Yeni sayfa</p>
        <h1 className="mt-1 text-3xl font-semibold text-ink">Baslangic kaydi</h1>

        <form action={createPageAction} className="mt-6 space-y-4">
          <label className="block text-sm font-medium text-ink/72">
            Baslik
            <input
              name="title"
              required
              defaultValue="Yeni demo sayfasi"
              className="mt-1 w-full rounded-md border border-ink/15 bg-paper px-3 py-2 text-ink outline-none focus:border-cobalt"
            />
          </label>
          <label className="block text-sm font-medium text-ink/72">
            Slug
            <input
              name="slug"
              required
              defaultValue="yeni-demo-sayfasi"
              pattern="[a-z0-9-]+"
              className="mt-1 w-full rounded-md border border-ink/15 bg-paper px-3 py-2 text-ink outline-none focus:border-cobalt"
            />
          </label>
          <label className="block text-sm font-medium text-ink/72">
            Durum
            <select
              name="status"
              defaultValue="draft"
              className="mt-1 w-full rounded-md border border-ink/15 bg-paper px-3 py-2 text-ink outline-none focus:border-cobalt"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </label>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-md bg-coral px-4 py-2 text-sm font-semibold text-white transition hover:bg-ink"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Olustur
          </button>
        </form>
      </section>
    </main>
  );
}
