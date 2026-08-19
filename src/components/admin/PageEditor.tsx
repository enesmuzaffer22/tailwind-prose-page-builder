"use client";

import {
  ArrowDown,
  ArrowUp,
  Code2,
  Eye,
  FileText,
  Plus,
  Save,
  Trash2,
  Type,
  X,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import { componentRegistry, isComponentKey } from "@/components/dynamic/registry";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { RenderBlock } from "@/lib/render-block";
import type { BuilderPage, ComponentDefinition, PageBlock, PageStatus, PropField } from "@/types/page-builder";

type PageEditorProps = {
  page: BuilderPage;
  definitions: ComponentDefinition[];
  action: (formData: FormData) => void;
  saved?: boolean;
};

function SaveButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center gap-2 rounded-md bg-coral px-4 py-2 text-sm font-semibold text-white transition hover:bg-ink disabled:opacity-50"
    >
      <Save className="h-4 w-4" aria-hidden="true" />
      {pending ? "Kaydediliyor" : "Kaydet"}
    </button>
  );
}

function nextId(blocks: PageBlock[]) {
  return Math.min(-1, ...blocks.map((block) => block.id - 1));
}

function normalize(blocks: PageBlock[]) {
  return blocks.map((block, index) => ({ ...block, sortOrder: index + 1 }));
}

function getDefaultProps(definition: ComponentDefinition) {
  if (isComponentKey(definition.key)) {
    return cloneValue(componentRegistry[definition.key].defaultProps);
  }

  return Object.fromEntries(
    definition.propsSchema.map((field) => [
      field.key,
      "default" in field ? field.default : field.type === "number" ? 0 : field.type === "boolean" ? false : "",
    ]),
  );
}

function cloneValue<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function updateProp(props: unknown, field: PropField, value: string | boolean) {
  const current = typeof props === "object" && props ? props : {};

  if (field.type === "number") {
    return { ...current, [field.key]: Number(value) };
  }

  if (field.type === "boolean") {
    return { ...current, [field.key]: Boolean(value) };
  }

  if (field.type === "json") {
    try {
      return { ...current, [field.key]: JSON.parse(String(value)) };
    } catch {
      return { ...current, [field.key]: value };
    }
  }

  return { ...current, [field.key]: value };
}

function readProp(props: unknown, key: string) {
  if (!props || typeof props !== "object") return undefined;
  return (props as Record<string, unknown>)[key];
}

function propsRecord(props: unknown) {
  return typeof props === "object" && props ? (props as Record<string, unknown>) : {};
}

function setProp(props: unknown, key: string, value: unknown) {
  return { ...propsRecord(props), [key]: value };
}

function fieldDefault(field: PropField) {
  return "default" in field ? field.default : undefined;
}

function asStringArray(value: unknown, fallback: unknown): string[] {
  const source = parseJsonLike(value) ?? fallback;
  if (!Array.isArray(source)) return [];
  return source.map((item) => String(item ?? ""));
}

function asObjectArray(value: unknown, fallback: unknown): Record<string, unknown>[] {
  const source = parseJsonLike(value) ?? fallback;
  if (!Array.isArray(source)) return [];
  return source.filter((item): item is Record<string, unknown> => typeof item === "object" && item !== null);
}

function parseJsonLike(value: unknown) {
  if (typeof value !== "string") return value;

  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function moveArrayItem<T>(items: T[], index: number, direction: -1 | 1) {
  const target = index + direction;
  if (target < 0 || target >= items.length) return items;
  const copy = [...items];
  [copy[index], copy[target]] = [copy[target], copy[index]];
  return copy;
}

function labelForKey(key: string) {
  const labels: Record<string, string> = {
    title: "Baslik",
    description: "Aciklama",
    label: "Etiket",
    value: "Deger",
    question: "Soru",
    answer: "Cevap",
    date: "Tarih / Faz",
  };

  return labels[key] ?? key;
}

function emptyObjectFor(keys: string[], index: number) {
  return Object.fromEntries(
    keys.map((key) => {
      if (key === "date") return [key, `Adim ${index + 1}`];
      if (key === "title") return [key, "Yeni baslik"];
      if (key === "question") return [key, "Yeni soru"];
      if (key === "label") return [key, "Yeni etiket"];
      if (key === "value") return [key, "Deger"];
      return [key, ""];
    }),
  );
}

export function PageEditor({ page, definitions, action, saved }: PageEditorProps) {
  const [title, setTitle] = useState(page.title);
  const [slug, setSlug] = useState(page.slug);
  const [status, setStatus] = useState<PageStatus>(page.status);
  const [blocks, setBlocks] = useState<PageBlock[]>(page.blocks);
  const [selectedId, setSelectedId] = useState(page.blocks[0]?.id ?? 0);
  const [adding, setAdding] = useState(false);

  const selectedBlock = useMemo(() => blocks.find((block) => block.id === selectedId), [blocks, selectedId]);
  const blocksJson = useMemo(() => JSON.stringify(normalize(blocks)), [blocks]);

  const patchBlock = (id: number, patch: Partial<PageBlock>) => {
    setBlocks((current) => current.map((block) => (block.id === id ? ({ ...block, ...patch } as PageBlock) : block)));
  };

  const addRichText = () => {
    const block: PageBlock = {
      id: nextId(blocks),
      type: "rich_text",
      content: "<h2>Yeni rich text blogu</h2><p>Kontrollu HTML buraya yazilir.</p>",
      sortOrder: blocks.length + 1,
    };
    setBlocks((current) => [...current, block]);
    setSelectedId(block.id);
    setAdding(false);
  };

  const addComponent = (definition: ComponentDefinition) => {
    const block: PageBlock = {
      id: nextId(blocks),
      type: "component",
      componentKey: definition.key,
      props: getDefaultProps(definition),
      sortOrder: blocks.length + 1,
    };
    setBlocks((current) => [...current, block]);
    setSelectedId(block.id);
    setAdding(false);
  };

  const move = (id: number, direction: -1 | 1) => {
    const index = blocks.findIndex((block) => block.id === id);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= blocks.length) return;
    const copy = [...blocks];
    [copy[index], copy[target]] = [copy[target], copy[index]];
    setBlocks(normalize(copy));
  };

  const remove = (id: number) => {
    const next = blocks.filter((block) => block.id !== id);
    setBlocks(normalize(next));
    setSelectedId(next[0]?.id ?? 0);
  };

  return (
    <form action={action} className="mx-auto w-full max-w-[1800px] px-4 py-6 xl:px-6">
      <input type="hidden" name="id" value={page.id} />
      <input type="hidden" name="blocksJson" value={blocksJson} />

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-cobalt">Page Editor</p>
          <h1 className="mt-1 text-3xl font-semibold text-ink">{title}</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {saved ? <span className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-800">Kaydedildi</span> : null}
          <Link
            href={`/${slug}?preview=1`}
            className="inline-flex items-center gap-2 rounded-md border border-ink/15 bg-white px-4 py-2 text-sm font-semibold text-ink transition hover:bg-mint"
          >
            <Eye className="h-4 w-4" aria-hidden="true" />
            Preview
          </Link>
          <SaveButton />
        </div>
      </div>

      <div className="mb-5 grid gap-3 rounded-md border border-ink/10 bg-white p-4 shadow-sm md:grid-cols-[1.2fr_1fr_180px]">
        <label className="text-sm font-medium text-ink/72">
          Baslik
          <input
            name="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="mt-1 w-full rounded-md border border-ink/15 bg-paper px-3 py-2 text-ink outline-none focus:border-cobalt"
          />
        </label>
        <label className="text-sm font-medium text-ink/72">
          Slug
          <input
            name="slug"
            value={slug}
            onChange={(event) => setSlug(event.target.value)}
            className="mt-1 w-full rounded-md border border-ink/15 bg-paper px-3 py-2 text-ink outline-none focus:border-cobalt"
          />
        </label>
        <label className="text-sm font-medium text-ink/72">
          Durum
          <select
            name="status"
            value={status}
            onChange={(event) => setStatus(event.target.value as PageStatus)}
            className="mt-1 w-full rounded-md border border-ink/15 bg-paper px-3 py-2 text-ink outline-none focus:border-cobalt"
          >
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </label>
      </div>

      <div className="grid min-h-[calc(100vh-260px)] gap-5 xl:grid-cols-[300px_minmax(520px,1fr)_minmax(420px,560px)]">
        <aside className="rounded-md border border-ink/10 bg-white p-4 shadow-sm xl:sticky xl:top-6 xl:self-start">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-ink/62">Bloklar</h2>
            <button
              type="button"
              title="Blok ekle"
              aria-label="Blok ekle"
              onClick={() => setAdding(true)}
              className="grid h-9 w-9 place-items-center rounded-md bg-ink text-white transition hover:bg-cobalt"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div className="space-y-2">
            {blocks.map((block, index) => (
              <button
                key={block.id}
                type="button"
                onClick={() => setSelectedId(block.id)}
                className={`flex w-full items-center gap-3 rounded-md border p-3 text-left transition ${
                  block.id === selectedId ? "border-cobalt bg-blue-50" : "border-ink/10 bg-paper hover:bg-mint"
                }`}
              >
                {block.type === "rich_text" ? (
                  <Type className="h-4 w-4 text-cobalt" aria-hidden="true" />
                ) : (
                  <Code2 className="h-4 w-4 text-coral" aria-hidden="true" />
                )}
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-ink">
                    {block.type === "rich_text" ? "Rich Text" : block.componentKey}
                  </span>
                  <span className="text-xs text-ink/52">Sira {index + 1}</span>
                </span>
              </button>
            ))}
          </div>
        </aside>

        <section className="rounded-md border border-ink/10 bg-white p-4 shadow-sm">
          {selectedBlock ? (
            <div>
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-ink/62">Ayarlar</h2>
                  <p className="mt-1 text-sm text-ink/55">
                    {selectedBlock.type === "rich_text" ? "Rich text blogu" : selectedBlock.componentKey}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    title="Yukari tasi"
                    aria-label="Blogu yukari tasi"
                    onClick={() => move(selectedBlock.id, -1)}
                    className="grid h-9 w-9 place-items-center rounded-md border border-ink/15 text-ink transition hover:bg-mint"
                  >
                    <ArrowUp className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    title="Asagi tasi"
                    aria-label="Blogu asagi tasi"
                    onClick={() => move(selectedBlock.id, 1)}
                    className="grid h-9 w-9 place-items-center rounded-md border border-ink/15 text-ink transition hover:bg-mint"
                  >
                    <ArrowDown className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    title="Sil"
                    aria-label="Blogu sil"
                    onClick={() => remove(selectedBlock.id)}
                    className="grid h-9 w-9 place-items-center rounded-md border border-red-200 text-red-700 transition hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>

              {selectedBlock.type === "rich_text" ? (
                <RichTextEditor
                  value={selectedBlock.content}
                  onChange={(content) => patchBlock(selectedBlock.id, { content })}
                />
              ) : (
                <ComponentPropsEditor
                  block={selectedBlock}
                  definition={definitions.find((definition) => definition.key === selectedBlock.componentKey)}
                  onChange={(props) => patchBlock(selectedBlock.id, { props })}
                />
              )}
            </div>
          ) : (
            <div className="flex h-full min-h-80 items-center justify-center text-sm text-ink/55">
              <FileText className="mr-2 h-4 w-4" aria-hidden="true" />
              Blok yok
            </div>
          )}
        </section>

        <section className="rounded-md border border-ink/10 bg-white p-4 shadow-sm xl:sticky xl:top-6 xl:max-h-[calc(100vh-48px)] xl:overflow-y-auto">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-ink/62">Tam sayfa onizleme</h2>
              <p className="mt-1 text-sm text-ink/55">{blocks.length} blok sirali render edilir</p>
            </div>
            <Link
              href={`/${slug}?preview=1`}
              className="inline-flex items-center gap-2 rounded-md border border-ink/15 px-3 py-2 text-sm font-semibold text-ink transition hover:bg-mint"
            >
              <Eye className="h-4 w-4" aria-hidden="true" />
              Ac
            </Link>
          </div>

          {blocks.length ? (
            <article className="prose prose-sm max-w-none prose-headings:text-ink prose-a:text-cobalt prose-blockquote:border-coral prose-blockquote:text-ink/80 prose-code:text-coral prose-pre:bg-ink prose-img:rounded-md">
              {normalize(blocks).map((block) => (
                <RenderBlock key={block.id} block={block} />
              ))}
            </article>
          ) : (
            <div className="flex min-h-80 items-center justify-center text-sm text-ink/55">
              <FileText className="mr-2 h-4 w-4" aria-hidden="true" />
              Onizlenecek blok yok
            </div>
          )}
        </section>
      </div>

      {adding ? (
        <div className="fixed inset-0 z-20 overflow-y-auto bg-ink/40 p-4">
          <div className="mx-auto flex min-h-full w-full max-w-2xl items-center">
            <div className="flex max-h-[calc(100vh-2rem)] w-full flex-col rounded-md bg-white shadow-soft">
            <div className="flex flex-none items-center justify-between border-b border-ink/10 p-5">
              <h2 className="text-lg font-semibold text-ink">Add Block</h2>
              <button
                type="button"
                title="Kapat"
                aria-label="Kapat"
                onClick={() => setAdding(false)}
                className="grid h-9 w-9 place-items-center rounded-md border border-ink/15 text-ink transition hover:bg-mint"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <div className="grid min-h-0 flex-1 gap-3 overflow-y-auto p-5 sm:grid-cols-2">
              <button
                type="button"
                onClick={addRichText}
                className="rounded-md border border-ink/10 bg-paper p-4 text-left transition hover:bg-mint"
              >
                <Type className="h-5 w-5 text-cobalt" aria-hidden="true" />
                <span className="mt-3 block font-semibold">Rich Text</span>
                <span className="mt-1 block text-sm text-ink/62">HTML content</span>
              </button>
              {definitions.map((definition) => (
                <button
                  key={definition.key}
                  type="button"
                  onClick={() => addComponent(definition)}
                  className="rounded-md border border-ink/10 bg-paper p-4 text-left transition hover:bg-mint"
                >
                  <Code2 className="h-5 w-5 text-coral" aria-hidden="true" />
                  <span className="mt-3 block font-semibold">{definition.name}</span>
                  <span className="mt-1 block text-sm text-ink/62">{definition.description}</span>
                </button>
              ))}
            </div>
            </div>
          </div>
        </div>
      ) : null}
    </form>
  );
}

function ComponentPropsEditor({
  block,
  definition,
  onChange,
}: {
  block: Extract<PageBlock, { type: "component" }>;
  definition?: ComponentDefinition;
  onChange: (props: unknown) => void;
}) {
  if (!definition) {
    return <p className="text-sm text-red-700">Component definition bulunamadi.</p>;
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border border-ink/10 bg-paper p-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-ink/52">Component</span>
        <p className="mt-1 font-semibold text-ink">{definition.name}</p>
      </div>

      {definition.propsSchema.map((field) => {
        const value = readProp(block.props, field.key);

        if (field.type === "textarea") {
          return (
            <label key={field.key} className="block text-sm font-medium text-ink/72">
              {field.label}
              <textarea
                value={String(value ?? "")}
                onChange={(event) => onChange(updateProp(block.props, field, event.target.value))}
                rows={4}
                className="mt-1 w-full rounded-md border border-ink/15 bg-paper px-3 py-2 text-ink outline-none focus:border-cobalt"
              />
            </label>
          );
        }

        if (field.type === "select") {
          return (
            <label key={field.key} className="block text-sm font-medium text-ink/72">
              {field.label}
              <select
                value={String(value ?? field.default ?? "")}
                onChange={(event) => onChange(updateProp(block.props, field, event.target.value))}
                className="mt-1 w-full rounded-md border border-ink/15 bg-paper px-3 py-2 text-ink outline-none focus:border-cobalt"
              >
                {field.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          );
        }

        if (field.type === "json") {
          return (
            <StructuredJsonField
              key={field.key}
              block={block}
              field={field}
              value={value}
              onChange={(nextValue) => onChange(setProp(block.props, field.key, nextValue))}
            />
          );
        }

        if (field.type === "boolean") {
          return (
            <label key={field.key} className="flex items-center gap-3 text-sm font-medium text-ink/72">
              <input
                type="checkbox"
                checked={Boolean(value)}
                onChange={(event) => onChange(updateProp(block.props, field, event.target.checked))}
                className="h-4 w-4 rounded border-ink/20 text-cobalt"
              />
              {field.label}
            </label>
          );
        }

        return (
          <label key={field.key} className="block text-sm font-medium text-ink/72">
            {field.label}
            <input
              type={field.type === "number" ? "number" : "text"}
              value={String(value ?? field.default ?? "")}
              onChange={(event) => onChange(updateProp(block.props, field, event.target.value))}
              className="mt-1 w-full rounded-md border border-ink/15 bg-paper px-3 py-2 text-ink outline-none focus:border-cobalt"
            />
          </label>
        );
      })}
    </div>
  );
}

function StructuredJsonField({
  block,
  field,
  value,
  onChange,
}: {
  block: Extract<PageBlock, { type: "component" }>;
  field: Extract<PropField, { type: "json" }>;
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  const fallback = fieldDefault(field);

  if (block.componentKey === "comparisonTable" && field.key === "columns") {
    return <StringListEditor label={field.label} value={asStringArray(value, fallback)} onChange={onChange} itemLabel="Kolon" />;
  }

  if (block.componentKey === "comparisonTable" && field.key === "rows") {
    const columns = asStringArray(readProp(block.props, "columns"), ["Kolon 1", "Kolon 2"]);
    return (
      <ComparisonRowsEditor
        label={field.label}
        columns={columns}
        value={asObjectArray(value, fallback)}
        onChange={onChange}
      />
    );
  }

  const rows = asObjectArray(value, fallback);
  const fallbackRows = asObjectArray(fallback, fallback);
  const keys = Object.keys(rows[0] ?? fallbackRows[0] ?? {});

  if (keys.length) {
    return <ObjectListEditor label={field.label} keysList={keys} value={rows} onChange={onChange} />;
  }

  return <StringListEditor label={field.label} value={asStringArray(value, fallback)} onChange={onChange} itemLabel="Deger" />;
}

function StringListEditor({
  label,
  value,
  onChange,
  itemLabel,
}: {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  itemLabel: string;
}) {
  const items = value.length ? value : [""];

  return (
    <div className="space-y-3 rounded-md border border-ink/10 bg-paper p-3">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-ink/72">{label}</span>
        <button
          type="button"
          onClick={() => onChange([...items, `${itemLabel} ${items.length + 1}`])}
          className="inline-flex items-center gap-2 rounded-md border border-ink/15 bg-white px-3 py-1.5 text-xs font-semibold text-ink transition hover:bg-mint"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          Ekle
        </button>
      </div>

      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={`${itemLabel}-${index}`} className="flex items-center gap-2">
            <input
              value={item}
              onChange={(event) => onChange(items.map((current, itemIndex) => (itemIndex === index ? event.target.value : current)))}
              className="min-w-0 flex-1 rounded-md border border-ink/15 bg-white px-3 py-2 text-sm text-ink outline-none focus:border-cobalt"
            />
            <button
              type="button"
              title="Sil"
              aria-label="Satiri sil"
              disabled={items.length <= 1}
              onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))}
              className="grid h-9 w-9 place-items-center rounded-md border border-red-200 bg-white text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ObjectListEditor({
  label,
  keysList,
  value,
  onChange,
}: {
  label: string;
  keysList: string[];
  value: Record<string, unknown>[];
  onChange: (value: Record<string, unknown>[]) => void;
}) {
  const items = value.length ? value : [emptyObjectFor(keysList, 0)];

  return (
    <div className="space-y-3 rounded-md border border-ink/10 bg-paper p-3">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-ink/72">{label}</span>
        <button
          type="button"
          onClick={() => onChange([...items, emptyObjectFor(keysList, items.length)])}
          className="inline-flex items-center gap-2 rounded-md border border-ink/15 bg-white px-3 py-1.5 text-xs font-semibold text-ink transition hover:bg-mint"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          Ekle
        </button>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={`${label}-${index}`} className="rounded-md border border-ink/10 bg-white p-3">
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink/48">#{index + 1}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  title="Yukari tasi"
                  aria-label="Satiri yukari tasi"
                  onClick={() => onChange(moveArrayItem(items, index, -1))}
                  className="grid h-8 w-8 place-items-center rounded-md border border-ink/15 text-ink transition hover:bg-mint"
                >
                  <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  title="Asagi tasi"
                  aria-label="Satiri asagi tasi"
                  onClick={() => onChange(moveArrayItem(items, index, 1))}
                  className="grid h-8 w-8 place-items-center rounded-md border border-ink/15 text-ink transition hover:bg-mint"
                >
                  <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  title="Sil"
                  aria-label="Satiri sil"
                  disabled={items.length <= 1}
                  onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))}
                  className="grid h-8 w-8 place-items-center rounded-md border border-red-200 text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {keysList.map((key) => {
                const isLong = ["description", "answer"].includes(key);

                return (
                  <label key={key} className="block text-sm font-medium text-ink/72">
                    {labelForKey(key)}
                    {isLong ? (
                      <textarea
                        value={String(item[key] ?? "")}
                        onChange={(event) =>
                          onChange(items.map((current, itemIndex) => (itemIndex === index ? { ...current, [key]: event.target.value } : current)))
                        }
                        rows={3}
                        className="mt-1 w-full rounded-md border border-ink/15 bg-paper px-3 py-2 text-ink outline-none focus:border-cobalt"
                      />
                    ) : (
                      <input
                        value={String(item[key] ?? "")}
                        onChange={(event) =>
                          onChange(items.map((current, itemIndex) => (itemIndex === index ? { ...current, [key]: event.target.value } : current)))
                        }
                        className="mt-1 w-full rounded-md border border-ink/15 bg-paper px-3 py-2 text-ink outline-none focus:border-cobalt"
                      />
                    )}
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ComparisonRowsEditor({
  label,
  columns,
  value,
  onChange,
}: {
  label: string;
  columns: string[];
  value: Record<string, unknown>[];
  onChange: (value: Record<string, unknown>[]) => void;
}) {
  const items = value.length ? value : [{ label: "Yeni satir", values: columns.map(() => "") }];

  const normalized = items.map((item) => {
    const values = Array.isArray(item.values) ? item.values : [];
    return {
      label: String(item.label ?? ""),
      values: columns.map((_, index) => String(values[index] ?? "")),
    };
  });

  return (
    <div className="space-y-3 rounded-md border border-ink/10 bg-paper p-3">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-ink/72">{label}</span>
        <button
          type="button"
          onClick={() => onChange([...normalized, { label: "Yeni satir", values: columns.map(() => "") }])}
          className="inline-flex items-center gap-2 rounded-md border border-ink/15 bg-white px-3 py-1.5 text-xs font-semibold text-ink transition hover:bg-mint"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          Satir ekle
        </button>
      </div>

      <div className="space-y-3">
        {normalized.map((row, rowIndex) => (
          <div key={`${label}-${rowIndex}`} className="rounded-md border border-ink/10 bg-white p-3">
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink/48">Satir {rowIndex + 1}</span>
              <button
                type="button"
                title="Sil"
                aria-label="Satiri sil"
                disabled={normalized.length <= 1}
                onClick={() => onChange(normalized.filter((_, index) => index !== rowIndex))}
                className="grid h-8 w-8 place-items-center rounded-md border border-red-200 text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <label className="block text-sm font-medium text-ink/72 md:col-span-2">
                Ozellik
                <input
                  value={row.label}
                  onChange={(event) =>
                    onChange(normalized.map((current, index) => (index === rowIndex ? { ...current, label: event.target.value } : current)))
                  }
                  className="mt-1 w-full rounded-md border border-ink/15 bg-paper px-3 py-2 text-ink outline-none focus:border-cobalt"
                />
              </label>

              {columns.map((column, columnIndex) => (
                <label key={`${rowIndex}-${column}`} className="block text-sm font-medium text-ink/72">
                  {column}
                  <input
                    value={row.values[columnIndex] ?? ""}
                    onChange={(event) =>
                      onChange(
                        normalized.map((current, index) =>
                          index === rowIndex
                            ? {
                                ...current,
                                values: current.values.map((currentValue, valueIndex) =>
                                  valueIndex === columnIndex ? event.target.value : currentValue,
                                ),
                              }
                            : current,
                        ),
                      )
                    }
                    className="mt-1 w-full rounded-md border border-ink/15 bg-paper px-3 py-2 text-ink outline-none focus:border-cobalt"
                  />
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
