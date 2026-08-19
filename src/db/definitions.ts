import type { PropField } from "@/types/page-builder";

export const componentDefinitionSeed: {
  key: string;
  name: string;
  description: string;
  propsSchema: PropField[];
}[] = [
  {
    key: "alert",
    name: "Alert",
    description: "Sayfa icinde bilgilendirme mesaji gosterir.",
    propsSchema: [
      { key: "title", label: "Baslik", type: "string", required: true },
      { key: "description", label: "Aciklama", type: "textarea", required: true },
      {
        key: "variant",
        label: "Variant",
        type: "select",
        options: ["info", "success", "warning", "danger"],
        default: "info",
      },
    ],
  },
  {
    key: "callToAction",
    name: "Call To Action",
    description: "Okuru belirli bir adima yonlendiren cagridir.",
    propsSchema: [
      { key: "title", label: "Baslik", type: "string", required: true },
      { key: "description", label: "Aciklama", type: "textarea", required: true },
      { key: "buttonText", label: "Buton metni", type: "string", required: true },
      { key: "buttonUrl", label: "Buton adresi", type: "string", required: true },
    ],
  },
  {
    key: "pricingCalculator",
    name: "Pricing Calculator",
    description: "Database'ten gelen fiyat prop'uyla client-side hesaplama yapar.",
    propsSchema: [
      { key: "title", label: "Baslik", type: "string", required: true },
      { key: "unitPrice", label: "Birim fiyat", type: "number", required: true, default: 25 },
      { key: "minQuantity", label: "Minimum adet", type: "number", required: true, default: 1 },
      { key: "maxQuantity", label: "Maksimum adet", type: "number", required: true, default: 100 },
      { key: "currency", label: "Para birimi", type: "string", required: true, default: "TRY" },
    ],
  },
  {
    key: "stats",
    name: "Stats",
    description: "Kucuk metrik kartlari gosterir.",
    propsSchema: [
      {
        key: "items",
        label: "Metrikler",
        type: "json",
        required: true,
        default: [
          { label: "Kullanici", value: "12K+" },
          { label: "Makale", value: "340" },
          { label: "Uptime", value: "99.9%" },
        ],
      },
    ],
  },
  {
    key: "featureGrid",
    name: "Feature Grid",
    description: "Baslikli ozellik kartlari gosterir.",
    propsSchema: [
      { key: "eyebrow", label: "Eyebrow", type: "string" },
      { key: "title", label: "Baslik", type: "string", required: true },
      {
        key: "items",
        label: "Ozellikler",
        type: "json",
        required: true,
        default: [
          { title: "Kontrollu HTML", description: "Editor izin verilen elementleri uretir." },
          { title: "Component registry", description: "Database sadece component anahtari saklar." },
        ],
      },
    ],
  },
  {
    key: "testimonial",
    name: "Testimonial",
    description: "Alinti ve kaynak bilgisi gosterir.",
    propsSchema: [
      { key: "quote", label: "Alinti", type: "textarea", required: true },
      { key: "author", label: "Yazar", type: "string", required: true },
      { key: "role", label: "Rol", type: "string", required: true },
      { key: "company", label: "Kurum", type: "string" },
    ],
  },
  {
    key: "faqAccordion",
    name: "FAQ Accordion",
    description: "Acilip kapanan soru-cevap listesi gosterir.",
    propsSchema: [
      { key: "title", label: "Baslik", type: "string", required: true },
      {
        key: "items",
        label: "Sorular",
        type: "json",
        required: true,
        default: [
          { question: "React kodu database'te mi?", answer: "Hayir, source code icindeki registry'de durur." },
          { question: "Props nereden gelir?", answer: "SQLite icindeki props_json alanindan gelir." },
        ],
      },
    ],
  },
  {
    key: "timeline",
    name: "Timeline",
    description: "Fazlari veya olaylari sirali zaman cizelgesi olarak gosterir.",
    propsSchema: [
      { key: "title", label: "Baslik", type: "string", required: true },
      {
        key: "items",
        label: "Adimlar",
        type: "json",
        required: true,
        default: [
          { date: "Faz 1", title: "Model", description: "Blok veri yapisi kurulur." },
          { date: "Faz 2", title: "Renderer", description: "Sayfa dinamik olarak render edilir." },
        ],
      },
    ],
  },
  {
    key: "comparisonTable",
    name: "Comparison Table",
    description: "Iki veya daha fazla yaklasimi tablo uzerinden karsilastirir.",
    propsSchema: [
      { key: "title", label: "Baslik", type: "string", required: true },
      {
        key: "columns",
        label: "Kolonlar",
        type: "json",
        required: true,
        default: ["HTML sayfa", "Block model"],
      },
      {
        key: "rows",
        label: "Satirlar",
        type: "json",
        required: true,
        default: [
          { label: "React component", values: ["Zor", "Kolay"] },
          { label: "Prop kontrolu", values: ["Yok", "Var"] },
        ],
      },
    ],
  },
  {
    key: "actionAlert",
    name: "Action Alert",
    description: "Butona tiklandiginda alert tetikleyen demo component.",
    propsSchema: [
      { key: "title", label: "Baslik", type: "string", required: true },
      { key: "description", label: "Aciklama", type: "textarea", required: true },
      { key: "buttonText", label: "Buton metni", type: "string", required: true },
      { key: "alertMessage", label: "Alert mesaji", type: "textarea", required: true },
      {
        key: "variant",
        label: "Variant",
        type: "select",
        options: ["neutral", "success", "warning"],
        default: "neutral",
      },
    ],
  },
  {
    key: "copySnippet",
    name: "Copy Snippet",
    description: "Butona tiklandiginda metni panoya kopyalar.",
    propsSchema: [
      { key: "title", label: "Baslik", type: "string", required: true },
      { key: "textToCopy", label: "Kopyalanacak metin", type: "textarea", required: true },
      { key: "buttonText", label: "Buton metni", type: "string", required: true },
      { key: "successMessage", label: "Basari mesaji", type: "string", required: true },
    ],
  },
  {
    key: "choicePoll",
    name: "Choice Poll",
    description: "Buton secimiyle client-side sonuc gosterir.",
    propsSchema: [
      { key: "title", label: "Baslik", type: "string", required: true },
      { key: "description", label: "Aciklama", type: "textarea" },
      {
        key: "options",
        label: "Secenekler",
        type: "json",
        required: true,
        default: ["Prose", "not-prose", "Registry"],
      },
    ],
  },
];
