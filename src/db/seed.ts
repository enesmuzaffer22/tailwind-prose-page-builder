import { ensureDatabase, getPageBySlug } from "./index";

ensureDatabase();

const page = getPageBySlug("tailwind-prose-demo", true);
console.log(`Seed tamamlandi: /${page?.slug ?? "tailwind-prose-demo"}`);
