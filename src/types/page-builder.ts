export type PageStatus = "draft" | "published";

export type RichTextBlock = {
  id: number;
  type: "rich_text";
  content: string;
  sortOrder: number;
};

export type ComponentBlock = {
  id: number;
  type: "component";
  componentKey: string;
  props: unknown;
  sortOrder: number;
};

export type PageBlock = RichTextBlock | ComponentBlock;

export type BuilderPage = {
  id: number;
  title: string;
  slug: string;
  status: PageStatus;
  createdAt: string;
  updatedAt: string;
  blocks: PageBlock[];
};

export type PropField =
  | {
      key: string;
      label: string;
      type: "string" | "textarea" | "number" | "boolean";
      required?: boolean;
      default?: string | number | boolean;
    }
  | {
      key: string;
      label: string;
      type: "select";
      options: string[];
      required?: boolean;
      default?: string;
    }
  | {
      key: string;
      label: string;
      type: "json";
      required?: boolean;
      default?: unknown;
    };

export type ComponentDefinition = {
  id: number;
  key: string;
  name: string;
  description: string;
  propsSchema: PropField[];
  enabled: boolean;
};
