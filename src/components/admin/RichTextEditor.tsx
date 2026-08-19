"use client";

import { Mark, mergeAttributes, Extension } from "@tiptap/core";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { Table, TableCell, TableHeader, TableRow } from "@tiptap/extension-table";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Code2,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  ImageIcon,
  Italic,
  Keyboard,
  LinkIcon,
  List,
  ListOrdered,
  Pilcrow,
  Quote,
  Rows3,
  Table2,
  TextQuote,
} from "lucide-react";
import { useEffect } from "react";

type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
};

const LeadParagraph = Extension.create({
  name: "leadParagraph",
  addGlobalAttributes() {
    return [
      {
        types: ["paragraph"],
        attributes: {
          class: {
            default: null,
            parseHTML: (element) => (element.getAttribute("class") === "lead" ? "lead" : null),
            renderHTML: (attributes) => (attributes.class === "lead" ? { class: "lead" } : {}),
          },
        },
      },
    ];
  },
});

const Kbd = Mark.create({
  name: "kbd",
  parseHTML() {
    return [{ tag: "kbd" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["kbd", mergeAttributes(HTMLAttributes), 0];
  },
});

function ToolbarButton({
  label,
  active,
  disabled,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className={`grid h-9 w-9 place-items-center rounded-md border text-ink transition disabled:cursor-not-allowed disabled:opacity-40 ${
        active ? "border-cobalt bg-blue-50 text-cobalt" : "border-ink/15 bg-white hover:bg-mint"
      }`}
    >
      {children}
    </button>
  );
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
        link: false,
      }),
      LeadParagraph,
      Kbd,
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
        HTMLAttributes: {
          rel: "noreferrer noopener",
        },
      }),
      Image.configure({
        allowBase64: false,
        HTMLAttributes: {
          loading: "lazy",
        },
      }),
      Table.configure({
        resizable: false,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none min-h-[360px] rounded-md border border-ink/15 bg-paper p-4 outline-none prose-headings:text-ink prose-a:text-cobalt prose-blockquote:border-coral prose-pre:bg-ink prose-img:rounded-md",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor || editor.getHTML() === value) return;
    editor.commands.setContent(value, { emitUpdate: false });
  }, [editor, value]);

  if (!editor) {
    return <div className="min-h-[420px] rounded-md border border-ink/10 bg-paper" />;
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link adresi", previousUrl ?? "https://");

    if (url === null) return;

    if (!url.trim()) {
      editor.chain().focus().unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
  };

  const addImage = () => {
    const src = window.prompt("Gorsel adresi", "https://");
    if (!src?.trim()) return;

    const alt = window.prompt("Alt metin", "") ?? "";
    editor.chain().focus().setImage({ src: src.trim(), alt }).run();
  };

  const setLead = () => {
    editor.chain().focus().setParagraph().updateAttributes("paragraph", { class: "lead" }).run();
  };

  const unsetLead = () => {
    editor.chain().focus().setParagraph().updateAttributes("paragraph", { class: null }).run();
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 rounded-md border border-ink/10 bg-paper p-2">
        <ToolbarButton
          label="Paragraf"
          active={editor.isActive("paragraph") && !editor.isActive("paragraph", { class: "lead" })}
          onClick={() => unsetLead()}
        >
          <Pilcrow className="h-4 w-4" aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton label="Lead paragraf" active={editor.isActive("paragraph", { class: "lead" })} onClick={setLead}>
          <TextQuote className="h-4 w-4" aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton
          label="H1"
          active={editor.isActive("heading", { level: 1 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        >
          <Heading1 className="h-4 w-4" aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton
          label="H2"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 className="h-4 w-4" aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton
          label="H3"
          active={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          <Heading3 className="h-4 w-4" aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton
          label="H4"
          active={editor.isActive("heading", { level: 4 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        >
          <Heading4 className="h-4 w-4" aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton label="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold className="h-4 w-4" aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton label="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic className="h-4 w-4" aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton label="Inline code" active={editor.isActive("code")} onClick={() => editor.chain().focus().toggleCode().run()}>
          <Code2 className="h-4 w-4" aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton label="Keyboard input" active={editor.isActive("kbd")} onClick={() => editor.chain().focus().toggleMark("kbd").run()}>
          <Keyboard className="h-4 w-4" aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton label="Link" active={editor.isActive("link")} onClick={setLink}>
          <LinkIcon className="h-4 w-4" aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton label="Alinti" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          <Quote className="h-4 w-4" aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton label="Kod blogu" active={editor.isActive("codeBlock")} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
          <Rows3 className="h-4 w-4" aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton label="Madde listesi" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <List className="h-4 w-4" aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton
          label="Numarali liste"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="h-4 w-4" aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton label="Tablo ekle" onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>
          <Table2 className="h-4 w-4" aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton label="Gorsel ekle" onClick={addImage}>
          <ImageIcon className="h-4 w-4" aria-hidden="true" />
        </ToolbarButton>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
