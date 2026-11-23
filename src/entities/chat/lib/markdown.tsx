import { Fragment, type ReactNode } from "react";

// A small, safe Markdown subset for model answers: paragraphs, headings,
// bullet/numbered lists, **bold**, *italic*, `code`, ```blocks``` and
// http(s) links. Everything is rendered as React text: no HTML injection.

const INLINE =
  /(\*\*[^*]+\*\*|`[^`]+`|\*[^*\s][^*]*\*|\[[^\]]+\]\(https?:\/\/[^)\s]+\)|https?:\/\/[^\s)]+)/g;

export function renderInline(text: string, keyBase = "i"): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let n = 0;
  const re = new RegExp(INLINE.source, "g");
  for (let m = re.exec(text); m !== null; m = re.exec(text)) {
    const tok = m[0];
    const at = m.index;
    if (at > last) out.push(text.slice(last, at));
    const key = `${keyBase}-${n++}`;
    if (tok.startsWith("**")) {
      out.push(<strong key={key}>{tok.slice(2, -2)}</strong>);
    } else if (tok.startsWith("`")) {
      out.push(
        <code key={key} className="rounded bg-muted px-1 py-0.5 text-[0.9em]">
          {tok.slice(1, -1)}
        </code>,
      );
    } else if (tok.startsWith("*")) {
      out.push(<em key={key}>{tok.slice(1, -1)}</em>);
    } else if (tok.startsWith("[")) {
      const label = tok.slice(1, tok.indexOf("]"));
      const href = tok.slice(tok.indexOf("(") + 1, -1);
      out.push(
        <a
          key={key}
          href={href}
          target="_blank"
          rel="noreferrer"
          className="text-primary underline"
        >
          {label}
        </a>,
      );
    } else {
      out.push(
        <a
          key={key}
          href={tok}
          target="_blank"
          rel="noreferrer"
          className="text-primary underline break-all"
        >
          {tok}
        </a>,
      );
    }
    last = at + tok.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

type Block =
  | { kind: "p"; lines: string[] }
  | { kind: "h"; level: number; text: string }
  | { kind: "ul" | "ol"; items: string[] }
  | { kind: "code"; text: string };

export function parseBlocks(src: string): Block[] {
  const blocks: Block[] = [];
  const lines = src.replace(/\r\n/g, "\n").split("\n");
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.trim().startsWith("```")) {
      const body: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        body.push(lines[i++]);
      }
      i++;
      blocks.push({ kind: "code", text: body.join("\n") });
      continue;
    }
    const h = /^(#{1,4})\s+(.*)$/.exec(line);
    if (h) {
      blocks.push({ kind: "h", level: h[1].length, text: h[2] });
      i++;
      continue;
    }
    const ul = /^\s*[-*•]\s+(.*)$/;
    const ol = /^\s*\d+[.)]\s+(.*)$/;
    if (ul.test(line) || ol.test(line)) {
      const kind = ul.test(line) ? "ul" : "ol";
      const re = kind === "ul" ? ul : ol;
      const items: string[] = [];
      while (i < lines.length && re.test(lines[i])) {
        items.push((re.exec(lines[i]) as RegExpExecArray)[1]);
        i++;
      }
      blocks.push({ kind, items });
      continue;
    }
    if (!line.trim()) {
      i++;
      continue;
    }
    const para: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^(#{1,4})\s/.test(lines[i]) &&
      !ul.test(lines[i]) &&
      !ol.test(lines[i]) &&
      !lines[i].trim().startsWith("```")
    ) {
      para.push(lines[i++]);
    }
    blocks.push({ kind: "p", lines: para });
  }
  return blocks;
}

export function Markdown({ text }: { text: string }) {
  return (
    <div className="space-y-3 leading-relaxed">
      {parseBlocks(text).map((b, bi) => {
        const k = `b${bi}`;
        switch (b.kind) {
          case "code":
            return (
              <pre
                key={k}
                className="overflow-x-auto rounded-lg bg-muted p-3 text-xs"
              >
                {b.text}
              </pre>
            );
          case "h":
            return (
              <p key={k} className="font-semibold">
                {renderInline(b.text, k)}
              </p>
            );
          case "ul":
          case "ol": {
            const List = b.kind;
            return (
              <List
                key={k}
                className={
                  b.kind === "ul"
                    ? "list-disc pl-5 space-y-1"
                    : "list-decimal pl-5 space-y-1"
                }
              >
                {b.items.map((it, ii) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: static text
                  <li key={ii}>{renderInline(it, `${k}-${ii}`)}</li>
                ))}
              </List>
            );
          }
          default:
            return (
              <p key={k}>
                {b.lines.map((l, li) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: static text
                  <Fragment key={li}>
                    {li > 0 && <br />}
                    {renderInline(l, `${k}-${li}`)}
                  </Fragment>
                ))}
              </p>
            );
        }
      })}
    </div>
  );
}
