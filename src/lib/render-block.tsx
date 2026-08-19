import { componentRegistry, isComponentKey } from "@/components/dynamic/registry";
import { RichText } from "@/components/RichText";
import type { PageBlock } from "@/types/page-builder";
import type { ComponentType } from "react";

function ComponentError({ label, detail }: { label: string; detail?: string }) {
  return (
    <div className="not-prose my-8 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-900">
      <strong className="block">Component render edilemedi: {label}</strong>
      {detail ? <span className="mt-1 block text-red-800/80">{detail}</span> : null}
    </div>
  );
}

export function RenderBlock({ block }: { block: PageBlock }) {
  if (block.type === "rich_text") {
    return <RichText html={block.content} />;
  }

  if (!isComponentKey(block.componentKey)) {
    return <ComponentError label={block.componentKey} />;
  }

  const definition = componentRegistry[block.componentKey];
  const validation = definition.schema.safeParse(block.props);

  if (!validation.success) {
    const issue = validation.error.issues[0];
    const path = issue?.path.length ? issue.path.join(".") : "props";
    return <ComponentError label={block.componentKey} detail={`${path}: ${issue?.message ?? "Gecersiz veri"}`} />;
  }

  const Component = definition.component as ComponentType<Record<string, unknown>>;

  return (
    <div className="not-prose">
      <Component {...validation.data} />
    </div>
  );
}
