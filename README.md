# Tailwind Prose Dynamic Page Builder

HTML tabanli rich text bloklarini Tailwind Typography `prose` sinifi icinde, React component bloklarini ise `not-prose` icinde render eden kucuk bir Next.js demo projesi.

## Calistirma

```bash
npm install
npm run db:seed
npm run dev
```

Yerel adresler:

- Public demo: `http://localhost:3000/tailwind-prose-demo`
- Admin dashboard: `http://localhost:3000/admin`
- Sayfa listesi: `http://localhost:3000/admin/pages`
- Demo editor: `http://localhost:3000/admin/pages/1`

## Ana fikir

Sayfa icerigi SQLite icinde yapisal bloklar olarak tutulur:

- `rich_text`: Kontrollu HTML string'i
- `component`: `component_key` ve `props_json`

Admin tarafinda rich text icerigi Tiptap tabanli gorsel editor ile duzenlenir; kullanici HTML kodu yazmak zorunda kalmaz. Editor arka planda kontrollu HTML uretir.

Component prop'lari da schema-driven form alanlariyla duzenlenir. Tekrarlayan alanlarda JSON textarea yerine satir ekleme, silme ve siralama kontrolleri kullanilir.

Renderer rich text bloklarini sanitize ederek `prose` kapsaminda gosterir. Component bloklari registry uzerinden bulunur, Zod ile validate edilir ve `not-prose` ile tipografi stillerinden izole edilir.

## Component katalogu

- `alert`: Bilgilendirme kutusu
- `callToAction`: CTA bandi
- `pricingCalculator`: Client-side fiyat hesaplayici
- `stats`: Metrik kartlari
- `featureGrid`: Ozellik kartlari
- `testimonial`: Alinti/kullanici yorumu
- `faqAccordion`: Acilip kapanan SSS component'i
- `timeline`: Faz veya olay cizelgesi
- `comparisonTable`: Yaklasim karsilastirma tablosu
- `actionAlert`: Butona tiklandiginda alert tetikleyen demo
- `copySnippet`: Butona tiklandiginda metni panoya kopyalayan demo
- `choicePoll`: Buton secimiyle client-side sonuc gosteren mini anket

## Onemli dosyalar

- `src/db/index.ts`: SQLite kurulumu, seed, sorgular ve mutation yardimcilari
- `src/db/schema.ts`: `pages`, `page_blocks`, `component_definitions`
- `src/lib/render-block.tsx`: Rich text/component blok ayrimi
- `src/lib/sanitize-html.ts`: HTML whitelist ve attribute sanitization
- `src/components/dynamic/registry.ts`: Component registry ve Zod semalari
- `src/components/admin/RichTextEditor.tsx`: Tiptap tabanli gorsel rich text editor
- `src/components/admin/PageEditor.tsx`: Blok listesi, siralama, rich text ve schema-driven prop editor

## Demo akis

1. `/admin/pages/1` sayfasini ac.
2. Alert blogunu sec.
3. `variant` degerini `info` yerine `success` yap.
4. Kaydet.
5. `/tailwind-prose-demo` sayfasini yenile.
6. Pricing Calculator blogunda `unitPrice` degerini degistirip tekrar kaydet.

Bu akis, makaledeki `prose` + `not-prose` + registry + database-driven props fikrini hizli sekilde gosterir.
