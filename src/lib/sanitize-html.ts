import sanitizeHtml from "sanitize-html";

const allowedTags = [
  "h1",
  "h2",
  "h3",
  "h4",
  "p",
  "a",
  "blockquote",
  "figure",
  "figcaption",
  "strong",
  "em",
  "kbd",
  "code",
  "pre",
  "ol",
  "ul",
  "li",
  "dl",
  "dt",
  "dd",
  "table",
  "thead",
  "tbody",
  "tr",
  "th",
  "td",
  "img",
  "picture",
  "video",
  "hr",
];

export function sanitizeRichText(html: string) {
  return sanitizeHtml(html, {
    allowedTags,
    allowedAttributes: {
      a: ["href", "title", "target", "rel"],
      img: ["src", "alt", "title", "width", "height", "loading"],
      video: ["src", "controls", "poster", "width", "height"],
      p: ["class"],
      code: ["class"],
    },
    allowedClasses: {
      p: ["lead"],
      code: [/^language-[a-z0-9-]+$/],
    },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { rel: "noreferrer noopener" }, true),
      img: sanitizeHtml.simpleTransform("img", { loading: "lazy" }, true),
    },
  });
}
