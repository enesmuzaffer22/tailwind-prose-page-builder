import { z } from "zod";
import { ActionAlert } from "./ActionAlert";
import { Alert } from "./Alert";
import { ChoicePoll } from "./ChoicePoll";
import { CallToAction } from "./CallToAction";
import { ComparisonTable } from "./ComparisonTable";
import { CopySnippet } from "./CopySnippet";
import { FaqAccordion } from "./FaqAccordion";
import { FeatureGrid } from "./FeatureGrid";
import { PricingCalculator } from "./PricingCalculator";
import { Stats } from "./Stats";
import { Testimonial } from "./Testimonial";
import { Timeline } from "./Timeline";

const jsonArray = <Schema extends z.ZodTypeAny>(schema: Schema) =>
  z.preprocess((value) => {
    if (typeof value !== "string") return value;

    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }, schema);

export const alertSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  variant: z.enum(["info", "success", "warning", "danger"]),
});

export const callToActionSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  buttonText: z.string().min(1),
  buttonUrl: z.string().url().or(z.string().startsWith("/")),
});

export const pricingCalculatorSchema = z
  .object({
    title: z.string().min(1),
    unitPrice: z.number().positive(),
    minQuantity: z.number().int().min(1),
    maxQuantity: z.number().int().min(1),
    currency: z.string().min(3).max(3),
  })
  .refine((value) => value.maxQuantity >= value.minQuantity, {
    message: "maxQuantity minQuantity degerinden kucuk olamaz",
  });

export const statsSchema = z.object({
  items: jsonArray(z.array(z.object({ label: z.string().min(1), value: z.string().min(1) })).min(1)),
});

export const featureGridSchema = z.object({
  eyebrow: z.string().optional(),
  title: z.string().min(1),
  items: jsonArray(z.array(z.object({ title: z.string().min(1), description: z.string().min(1) })).min(1)),
});

export const testimonialSchema = z.object({
  quote: z.string().min(1),
  author: z.string().min(1),
  role: z.string().min(1),
  company: z.string().optional(),
});

export const faqAccordionSchema = z.object({
  title: z.string().min(1),
  items: jsonArray(z.array(z.object({ question: z.string().min(1), answer: z.string().min(1) })).min(1)),
});

export const timelineSchema = z.object({
  title: z.string().min(1),
  items: jsonArray(
    z.array(z.object({ date: z.string().min(1), title: z.string().min(1), description: z.string().min(1) })).min(1),
  ),
});

export const comparisonTableSchema = z.object({
  title: z.string().min(1),
  columns: jsonArray(z.array(z.string().min(1)).min(1)),
  rows: jsonArray(z.array(z.object({ label: z.string().min(1), values: z.array(z.string()) })).min(1)),
});

export const actionAlertSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  buttonText: z.string().min(1),
  alertMessage: z.string().min(1),
  variant: z.enum(["neutral", "success", "warning"]),
});

export const copySnippetSchema = z.object({
  title: z.string().min(1),
  textToCopy: z.string().min(1),
  buttonText: z.string().min(1),
  successMessage: z.string().min(1),
});

export const choicePollSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  options: jsonArray(z.array(z.string().min(1)).min(2)),
});

export const componentRegistry = {
  alert: {
    component: Alert,
    schema: alertSchema,
    defaultProps: {
      title: "Bilgilendirme",
      description: "Bu alan prose disinda calisan bir React component.",
      variant: "info",
    },
  },
  callToAction: {
    component: CallToAction,
    schema: callToActionSchema,
    defaultProps: {
      title: "Devam et",
      description: "Makaledeki mimariyi calisan bir demo uzerinden inceleyin.",
      buttonText: "Onizleme",
      buttonUrl: "/tailwind-prose-demo",
    },
  },
  pricingCalculator: {
    component: PricingCalculator,
    schema: pricingCalculatorSchema,
    defaultProps: {
      title: "Fiyat Hesaplayici",
      unitPrice: 25,
      minQuantity: 1,
      maxQuantity: 100,
      currency: "TRY",
    },
  },
  stats: {
    component: Stats,
    schema: statsSchema,
    defaultProps: {
      items: [
        { label: "Rich text blogu", value: "4" },
        { label: "React component", value: "3" },
        { label: "Guvenli render", value: "100%" },
      ],
    },
  },
  featureGrid: {
    component: FeatureGrid,
    schema: featureGridSchema,
    defaultProps: {
      eyebrow: "Mimari",
      title: "Bu yaklasimin kazandirdiklari",
      items: [
        {
          title: "Kontrollu HTML",
          description: "Editor yalnizca izin verilen rich text elementlerini uretir.",
        },
        {
          title: "Registry guvenligi",
          description: "Database component kodu degil, sadece component anahtari tutar.",
        },
        {
          title: "Prop validasyonu",
          description: "Bozuk JSON veya eksik alanlar sayfayi crash ettirmeden yakalanir.",
        },
        {
          title: "Canli onizleme",
          description: "Admin tarafinda bloklar kaydedilmeden once ayni renderer ile gorulur.",
        },
      ],
    },
  },
  testimonial: {
    component: Testimonial,
    schema: testimonialSchema,
    defaultProps: {
      quote: "Prose ve not-prose ayrimi, CMS icerigi ile uygulama componentlerini birbirine karistirmadan ayni sayfada anlatmayi kolaylastiriyor.",
      author: "Demo kullanicisi",
      role: "Frontend developer",
      company: "Medium makalesi",
    },
  },
  faqAccordion: {
    component: FaqAccordion,
    schema: faqAccordionSchema,
    defaultProps: {
      title: "Sik sorulanlar",
      items: [
        {
          question: "React kodu database'te mi duruyor?",
          answer: "Hayir. Database sadece component_key ve props_json saklar.",
        },
        {
          question: "Rich text neden HTML?",
          answer: "Tailwind Typography HTML elementlerini stillendirdigi icin model dogrudan HTML uzerinden ilerler.",
        },
        {
          question: "Component props bozuksa ne olur?",
          answer: "Zod validasyonu hatayi yakalar ve sayfa tamamen dusmeden hata alani render edilir.",
        },
      ],
    },
  },
  timeline: {
    component: Timeline,
    schema: timelineSchema,
    defaultProps: {
      title: "Demo gelistirme sirasi",
      items: [
        {
          date: "Faz 1",
          title: "Blok modeli",
          description: "Rich text ve component bloklari ayni sirali veri yapisinda tutulur.",
        },
        {
          date: "Faz 2",
          title: "Renderer",
          description: "Sayfa bloklari prose ve not-prose ayrimiyla render edilir.",
        },
        {
          date: "Faz 3",
          title: "Admin",
          description: "Editor, props formu ve canli onizleme eklenir.",
        },
      ],
    },
  },
  comparisonTable: {
    component: ComparisonTable,
    schema: comparisonTableSchema,
    defaultProps: {
      title: "Yaklasim karsilastirmasi",
      columns: ["HTML sayfa", "Block model"],
      rows: [
        { label: "React component", values: ["Zor", "Registry ile kolay"] },
        { label: "Prop kontrolu", values: ["Yok", "Zod schema"] },
        { label: "Tipografi", values: ["Manuel", "Tailwind prose"] },
      ],
    },
  },
  actionAlert: {
    component: ActionAlert,
    schema: actionAlertSchema,
    defaultProps: {
      title: "Buton aksiyonu",
      description: "Bu component butona tiklandiginda tarayici alert'i tetikler ve kendi state'ini gunceller.",
      buttonText: "Alert goster",
      alertMessage: "Bu mesaj component props_json alanindan geldi.",
      variant: "neutral",
    },
  },
  copySnippet: {
    component: CopySnippet,
    schema: copySnippetSchema,
    defaultProps: {
      title: "Kod parcasi kopyala",
      textToCopy: "not-prose + component registry + zod validation",
      buttonText: "Kopyala",
      successMessage: "Kopyalandi",
    },
  },
  choicePoll: {
    component: ChoicePoll,
    schema: choicePollSchema,
    defaultProps: {
      title: "Okur secimi",
      description: "Butonlardan biri secildiginde component client-side state ile sonucu gosterir.",
      options: ["Prose", "not-prose", "Registry"],
    },
  },
} as const;

export type ComponentKey = keyof typeof componentRegistry;

export function isComponentKey(value: string): value is ComponentKey {
  return value in componentRegistry;
}
