import { notFound } from "next/navigation";
import { updatePageAction } from "@/app/actions";
import { PageEditor } from "@/components/admin/PageEditor";
import { getPageById, listComponentDefinitions } from "@/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function EditPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ saved?: string }>;
}) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const page = getPageById(Number(id));

  if (!page) {
    notFound();
  }

  return (
    <PageEditor
      page={page}
      definitions={listComponentDefinitions()}
      action={updatePageAction}
      saved={query?.saved === "1"}
    />
  );
}
