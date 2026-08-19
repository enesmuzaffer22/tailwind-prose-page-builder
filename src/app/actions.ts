"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createPage, deletePage, updatePage } from "@/db";
import type { PageBlock, PageStatus } from "@/types/page-builder";

const slugSchema = z
  .string()
  .min(1)
  .regex(/^[a-z0-9-]+$/, "Slug sadece kucuk harf, rakam ve tire icerebilir.");

const createPageSchema = z.object({
  title: z.string().min(1),
  slug: slugSchema,
  status: z.enum(["draft", "published"]),
});

const updatePageSchema = createPageSchema.extend({
  id: z.coerce.number().int().positive(),
  blocksJson: z.string().min(2),
});

export async function createPageAction(formData: FormData) {
  const parsed = createPageSchema.parse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    status: formData.get("status"),
  });

  const id = createPage(parsed);
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/pages");
  redirect(`/admin/pages/${id}`);
}

export async function deletePageAction(formData: FormData) {
  const id = z.coerce.number().int().positive().parse(formData.get("id"));
  deletePage(id);
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/pages");
}

export async function updatePageAction(formData: FormData) {
  const parsed = updatePageSchema.parse({
    id: formData.get("id"),
    title: formData.get("title"),
    slug: formData.get("slug"),
    status: formData.get("status"),
    blocksJson: formData.get("blocksJson"),
  });

  const blocks = JSON.parse(parsed.blocksJson) as PageBlock[];

  updatePage({
    id: parsed.id,
    title: parsed.title,
    slug: parsed.slug,
    status: parsed.status as PageStatus,
    blocks,
  });

  revalidatePath("/");
  revalidatePath(`/${parsed.slug}`);
  revalidatePath("/admin");
  revalidatePath("/admin/pages");
  revalidatePath(`/admin/pages/${parsed.id}`);
  redirect(`/admin/pages/${parsed.id}?saved=1`);
}
