import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const pages = sqliteTable("pages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  status: text("status", { enum: ["draft", "published"] }).notNull().default("draft"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const pageBlocks = sqliteTable("page_blocks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  pageId: integer("page_id")
    .notNull()
    .references(() => pages.id, { onDelete: "cascade" }),
  type: text("type", { enum: ["rich_text", "component"] }).notNull(),
  componentKey: text("component_key"),
  content: text("content"),
  propsJson: text("props_json"),
  sortOrder: integer("sort_order").notNull(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const componentDefinitions = sqliteTable("component_definitions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  key: text("key").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  propsSchema: text("props_schema").notNull(),
  enabled: integer("enabled", { mode: "boolean" }).notNull().default(true),
});
