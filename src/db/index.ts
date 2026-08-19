import Database from "better-sqlite3";
import { and, desc, eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { componentDefinitionSeed } from "./definitions";
import { componentDefinitions, pageBlocks, pages } from "./schema";
import type { BuilderPage, ComponentDefinition, PageBlock, PageStatus } from "@/types/page-builder";

const dataDir = path.join(process.cwd(), "data");
const dbPath = path.join(dataDir, "app.db");

type SqliteGlobal = typeof globalThis & {
  __tailwindProseSqlite?: Database.Database;
};

function now() {
  return new Date().toISOString();
}

function sqlite() {
  const globalForDb = globalThis as SqliteGlobal;

  if (!globalForDb.__tailwindProseSqlite) {
    fs.mkdirSync(dataDir, { recursive: true });
    globalForDb.__tailwindProseSqlite = new Database(dbPath);
    globalForDb.__tailwindProseSqlite.pragma("foreign_keys = ON");
  }

  return globalForDb.__tailwindProseSqlite;
}

export const db = drizzle(sqlite());

export function ensureDatabase() {
  const connection = sqlite();

  connection.exec(`
    CREATE TABLE IF NOT EXISTS pages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      status TEXT NOT NULL DEFAULT 'draft',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS page_blocks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      page_id INTEGER NOT NULL,
      type TEXT NOT NULL,
      component_key TEXT,
      content TEXT,
      props_json TEXT,
      sort_order INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS component_definitions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      props_schema TEXT NOT NULL,
      enabled INTEGER NOT NULL DEFAULT 1
    );
  `);

  seedComponentDefinitions();
  seedDemoPage();
  seedActionDemoBlocks();
}

function seedComponentDefinitions() {
  for (const definition of componentDefinitionSeed) {
    db.insert(componentDefinitions)
      .values({
        key: definition.key,
        name: definition.name,
        description: definition.description,
        propsSchema: JSON.stringify(definition.propsSchema),
        enabled: true,
      })
      .onConflictDoUpdate({
        target: componentDefinitions.key,
        set: {
          name: definition.name,
          description: definition.description,
          propsSchema: JSON.stringify(definition.propsSchema),
          enabled: true,
        },
      })
      .run();
  }
}

function seedDemoPage() {
  const existing = db.select({ count: sql<number>`count(*)` }).from(pages).get();
  if (existing?.count) return;

  const timestamp = now();
  const page = db
    .insert(pages)
    .values({
      title: "Tailwind Prose ile Dinamik Sayfalar",
      slug: "tailwind-prose-demo",
      status: "published",
      createdAt: timestamp,
      updatedAt: timestamp,
    })
    .returning({ id: pages.id })
    .get();

  db.insert(pageBlocks)
    .values([
      {
        pageId: page.id,
        type: "rich_text",
        content:
          '<h1>Tailwind Prose ile Dinamik Sayfalar</h1><p class="lead">CMS icinden gelen kontrollu HTML bloklarini, React componentleriyle ayni akis icinde guvenli bicimde gosteren kucuk bir prototip.</p><p>Bu sayfadaki metin bloklari SQLite icinden geliyor ve Tailwind Typography tarafindan <strong>prose</strong> sinifi ile stillendiriliyor.</p>',
        sortOrder: 1,
        createdAt: timestamp,
        updatedAt: timestamp,
      },
      {
        pageId: page.id,
        type: "component",
        componentKey: "alert",
        propsJson: JSON.stringify({
          title: "Tailwind prose disinda calisan component",
          description: "Bu Alert component'i database'teki component_key ve props_json alanlarindan render edildi.",
          variant: "info",
        }),
        sortOrder: 2,
        createdAt: timestamp,
        updatedAt: timestamp,
      },
      {
        pageId: page.id,
        type: "rich_text",
        content:
          "<h2>Peki interaktif icerikler?</h2><p>Rich text blogu yalnizca HTML uretir. Interaktif UI ise component registry uzerinden secilir ve <code>not-prose</code> alani icinde izole edilir.</p><ul><li>Database React kodu saklamaz.</li><li>Component prop'lari Zod ile dogrulanir.</li><li>Hatalar sayfayi dusurmeden gosterilir.</li></ul>",
        sortOrder: 3,
        createdAt: timestamp,
        updatedAt: timestamp,
      },
      {
        pageId: page.id,
        type: "component",
        componentKey: "pricingCalculator",
        propsJson: JSON.stringify({
          title: "Fiyat Hesaplayici",
          unitPrice: 25,
          minQuantity: 1,
          maxQuantity: 100,
          currency: "TRY",
        }),
        sortOrder: 4,
        createdAt: timestamp,
        updatedAt: timestamp,
      },
      {
        pageId: page.id,
        type: "rich_text",
        content:
          '<h2>HTML dogrudan nasil korunuyor?</h2><p>Editor kontrollu HTML uretse bile render oncesinde whitelist tabanli sanitization uygulanir.</p><figure><img src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80" alt="Makale yazimi icin masaustu calisma alani" width="1200" height="720"><figcaption>Prototip, makale icinde ekran goruntusu alinabilecek sekilde gercek veriyle baslar.</figcaption></figure><pre><code class="language-ts">type PageBlock = RichTextBlock | ComponentBlock;</code></pre>',
        sortOrder: 5,
        createdAt: timestamp,
        updatedAt: timestamp,
      },
      {
        pageId: page.id,
        type: "component",
        componentKey: "stats",
        propsJson: JSON.stringify({
          items: [
            { label: "Rich text blogu", value: "3" },
            { label: "React component", value: "3" },
            { label: "SQLite tablo", value: "3" },
          ],
        }),
        sortOrder: 6,
        createdAt: timestamp,
        updatedAt: timestamp,
      },
      {
        pageId: page.id,
        type: "rich_text",
        content:
          "<h2>Sonuc</h2><p>Bu mimari Tailwind Typography'nin guclu oldugu HTML tipografisini, React'in guclu oldugu etkilesimli componentlerle birlestirir.</p><blockquote>Controlled HTML + React Components + Database-driven Props = Component-driven Dynamic Content</blockquote>",
        sortOrder: 7,
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    ])
    .run();
}

function seedActionDemoBlocks() {
  const page = db.select().from(pages).where(eq(pages.slug, "tailwind-prose-demo")).get();
  if (!page) return;

  const blocks = db
    .select()
    .from(pageBlocks)
    .where(eq(pageBlocks.pageId, page.id))
    .orderBy(pageBlocks.sortOrder)
    .all();
  const existingKeys = new Set(blocks.map((block) => block.componentKey).filter(Boolean));
  const timestamp = now();
  let sortOrder = blocks.reduce((max, block) => Math.max(max, block.sortOrder), 0);

  const actionBlocks = [
    {
      componentKey: "actionAlert",
      props: {
        title: "Butonla tetiklenen alert",
        description: "Bu blok, database'ten gelen mesaj prop'unu kullanarak buton tiklamasiyla aksiyon uretir.",
        buttonText: "Alert goster",
        alertMessage: "Merhaba! Bu mesaj SQLite props_json alanindan geldi.",
        variant: "success",
      },
    },
    {
      componentKey: "copySnippet",
      props: {
        title: "Mimari notunu kopyala",
        textToCopy: "Controlled HTML + React Components + Database-driven Props",
        buttonText: "Kopyala",
        successMessage: "Kopyalandi",
      },
    },
    {
      componentKey: "choicePoll",
      props: {
        title: "Makale demosunda en net fikir hangisi?",
        description: "Her secenek bir buton olarak render edilir; secim local component state'inde tutulur.",
        options: ["prose", "not-prose", "component registry", "props validation"],
      },
    },
  ];

  const missingBlocks = actionBlocks.filter((block) => !existingKeys.has(block.componentKey));
  if (!missingBlocks.length) return;

  db.insert(pageBlocks)
    .values(
      missingBlocks.map((block) => ({
        pageId: page.id,
        type: "component" as const,
        componentKey: block.componentKey,
        propsJson: JSON.stringify(block.props),
        sortOrder: ++sortOrder,
        createdAt: timestamp,
        updatedAt: timestamp,
      })),
    )
    .run();
}

function parseBlock(row: typeof pageBlocks.$inferSelect): PageBlock {
  if (row.type === "rich_text") {
    return {
      id: row.id,
      type: "rich_text",
      content: row.content ?? "",
      sortOrder: row.sortOrder,
    };
  }

  return {
    id: row.id,
    type: "component",
    componentKey: row.componentKey ?? "",
    props: row.propsJson ? JSON.parse(row.propsJson) : {},
    sortOrder: row.sortOrder,
  };
}

function parsePage(page: typeof pages.$inferSelect, blocks: (typeof pageBlocks.$inferSelect)[]): BuilderPage {
  return {
    id: page.id,
    title: page.title,
    slug: page.slug,
    status: page.status as PageStatus,
    createdAt: page.createdAt,
    updatedAt: page.updatedAt,
    blocks: blocks.map(parseBlock),
  };
}

export function listPages() {
  ensureDatabase();
  return db.select().from(pages).orderBy(desc(pages.updatedAt)).all();
}

export function listComponentDefinitions(): ComponentDefinition[] {
  ensureDatabase();
  return db
    .select()
    .from(componentDefinitions)
    .where(eq(componentDefinitions.enabled, true))
    .all()
    .map((definition) => ({
      id: definition.id,
      key: definition.key,
      name: definition.name,
      description: definition.description,
      propsSchema: JSON.parse(definition.propsSchema),
      enabled: definition.enabled,
    }));
}

export function getPageBySlug(slug: string, includeDraft = false) {
  ensureDatabase();
  const page = db
    .select()
    .from(pages)
    .where(includeDraft ? eq(pages.slug, slug) : and(eq(pages.slug, slug), eq(pages.status, "published")))
    .get();

  if (!page) return null;

  const blocks = db
    .select()
    .from(pageBlocks)
    .where(eq(pageBlocks.pageId, page.id))
    .orderBy(pageBlocks.sortOrder)
    .all();

  return parsePage(page, blocks);
}

export function getPageById(id: number) {
  ensureDatabase();
  const page = db.select().from(pages).where(eq(pages.id, id)).get();
  if (!page) return null;

  const blocks = db
    .select()
    .from(pageBlocks)
    .where(eq(pageBlocks.pageId, id))
    .orderBy(pageBlocks.sortOrder)
    .all();

  return parsePage(page, blocks);
}

export function getDashboardStats() {
  ensureDatabase();
  const allPages = listPages();
  return {
    total: allPages.length,
    published: allPages.filter((page) => page.status === "published").length,
    draft: allPages.filter((page) => page.status === "draft").length,
    recent: allPages.slice(0, 5),
  };
}

export function createPage(input: { title: string; slug: string; status: PageStatus }) {
  ensureDatabase();
  const timestamp = now();
  const page = db
    .insert(pages)
    .values({
      title: input.title,
      slug: input.slug,
      status: input.status,
      createdAt: timestamp,
      updatedAt: timestamp,
    })
    .returning({ id: pages.id })
    .get();

  db.insert(pageBlocks)
    .values({
      pageId: page.id,
      type: "rich_text",
      content: "<h1>Yeni sayfa</h1><p>Bu blogu editor uzerinden guncelleyebilirsiniz.</p>",
      sortOrder: 1,
      createdAt: timestamp,
      updatedAt: timestamp,
    })
    .run();

  return page.id;
}

export function deletePage(id: number) {
  ensureDatabase();
  db.delete(pages).where(eq(pages.id, id)).run();
}

export function updatePage(input: {
  id: number;
  title: string;
  slug: string;
  status: PageStatus;
  blocks: PageBlock[];
}) {
  ensureDatabase();
  const timestamp = now();

  sqlite().transaction(() => {
    db.update(pages)
      .set({ title: input.title, slug: input.slug, status: input.status, updatedAt: timestamp })
      .where(eq(pages.id, input.id))
      .run();

    db.delete(pageBlocks).where(eq(pageBlocks.pageId, input.id)).run();

    if (input.blocks.length) {
      db.insert(pageBlocks)
        .values(
          input.blocks.map((block, index) => ({
            pageId: input.id,
            type: block.type,
            componentKey: block.type === "component" ? block.componentKey : null,
            content: block.type === "rich_text" ? block.content : null,
            propsJson: block.type === "component" ? JSON.stringify(block.props) : null,
            sortOrder: index + 1,
            createdAt: timestamp,
            updatedAt: timestamp,
          })),
        )
        .run();
    }
  })();
}
