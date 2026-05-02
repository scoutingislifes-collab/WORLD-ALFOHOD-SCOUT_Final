#!/usr/bin/env node
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join, extname } from "node:path";

const SRC_DIR = join(process.cwd(), "src");

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...await walk(full));
    else out.push(full);
  }
  return out;
}

async function main() {
  const files = (await walk(SRC_DIR)).filter(f =>
    [".tsx", ".jsx"].includes(extname(f).toLowerCase())
  );
  let edits = 0;
  for (const f of files) {
    const original = await readFile(f, "utf8");

    // Match <img ...> JSX tags. Skip ones that already have loading= attr.
    // Add `loading="lazy" decoding="async"` right after `<img`.
    const next = original.replace(/<img(\s+)((?:(?!loading=)[^>])*?)\/?>/g, (match, ws, rest) => {
      // Already has loading? leave alone
      if (/\bloading\s*=/.test(match)) return match;
      const hasDecoding = /\bdecoding\s*=/.test(match);
      const extra = hasDecoding ? `loading="lazy"` : `loading="lazy" decoding="async"`;
      return match.replace(/^<img/, `<img ${extra}`);
    });

    if (next !== original) {
      await writeFile(f, next, "utf8");
      edits++;
      console.log(`✓ ${f.replace(process.cwd() + "/", "")}`);
    }
  }
  console.log(`\nUpdated ${edits} files.`);
}

main().catch(e => { console.error(e); process.exit(1); });
