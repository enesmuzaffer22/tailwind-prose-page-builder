import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Pencil } from "lucide-react";
import { getPageBySlug } from "@/db";
import { RenderBlock } from "@/lib/render-block";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function DynamicPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ preview?: string }>;
}) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const includeDraft = query?.preview === "1";
  const page = getPageBySlug(slug, includeDraft);

  if (!page) {
    notFound();
  }

  return (
    <main className="min-h-screen px-5 py-8">
      <div className="mx-auto max-w-4xl">
        <nav className="mb-8 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-ink/70 hover:text-ink">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Ana sayfa
          </Link>
          <Link
            href={`/admin/pages/${page.id}`}
            className="inline-flex items-center gap-2 rounded-md border border-ink/15 bg-white px-3 py-2 text-sm font-semibold text-ink transition hover:bg-mint"
          >
            <Pencil className="h-4 w-4" aria-hidden="true" />
            Duzenle
          </Link>
        </nav>

        <article className="prose prose-lg max-w-none prose-headings:text-ink prose-a:text-cobalt prose-blockquote:border-coral prose-blockquote:text-ink/80 prose-code:text-coral prose-pre:bg-ink prose-img:rounded-md">
          {page.blocks.map((block) => (
            <RenderBlock key={block.id} block={block} />
          ))}
        </article>
      </div>
    </main>
  );
}
