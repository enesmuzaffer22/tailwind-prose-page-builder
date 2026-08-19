import Link from "next/link";

export function AdminNav() {
  return (
    <header className="border-b border-ink/10 bg-white/84 backdrop-blur">
      <div className="mx-auto flex w-full max-w-[1800px] items-center justify-between px-4 py-4 xl:px-6">
        <Link href="/admin" className="text-sm font-semibold text-ink">
          Tailwind Prose Builder
        </Link>
        <nav className="flex items-center gap-2 text-sm">
          <Link className="rounded-md px-3 py-2 text-ink/70 transition hover:bg-mint hover:text-ink" href="/admin/pages">
            Sayfalar
          </Link>
          <Link className="rounded-md px-3 py-2 text-ink/70 transition hover:bg-mint hover:text-ink" href="/">
            Site
          </Link>
        </nav>
      </div>
    </header>
  );
}
