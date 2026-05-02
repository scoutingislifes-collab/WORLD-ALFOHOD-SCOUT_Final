#!/usr/bin/env node
import { readdir, stat, readFile, writeFile, unlink } from "node:fs/promises";
import { join, extname } from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const IMAGE_DIR = join(ROOT, "src", "assets", "images");
const SRC_DIR = join(ROOT, "src");
const QUALITY = 82;

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...await walk(full));
    else out.push(full);
  }
  return out;
}

async function convertImage(file) {
  const ext = extname(file).toLowerCase();
  if (ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg") return null;
  const out = file.replace(/\.(png|jpe?g)$/i, ".webp");
  const beforeBytes = (await stat(file)).size;
  await sharp(file).webp({ quality: QUALITY, effort: 5 }).toFile(out);
  const afterBytes = (await stat(out)).size;
  await unlink(file);
  return { from: file, to: out, beforeBytes, afterBytes };
}

async function rewriteImports() {
  const files = await walk(SRC_DIR);
  let edits = 0;
  for (const f of files) {
    const ext = extname(f).toLowerCase();
    if (![".ts", ".tsx", ".js", ".jsx", ".css"].includes(ext)) continue;
    const original = await readFile(f, "utf8");
    const next = original.replace(/(\/?images\/[A-Za-z0-9_\-/.]+?)\.(png|jpe?g)(["'])/gi, "$1.webp$3");
    if (next !== original) {
      await writeFile(f, next, "utf8");
      edits++;
    }
  }
  return edits;
}

async function main() {
  const files = await walk(IMAGE_DIR);
  const results = [];
  let savedTotal = 0;
  for (const f of files) {
    try {
      const r = await convertImage(f);
      if (r) {
        results.push(r);
        savedTotal += r.beforeBytes - r.afterBytes;
      }
    } catch (e) {
      console.error("Failed:", f, e.message);
    }
  }
  for (const r of results) {
    const pct = ((1 - r.afterBytes / r.beforeBytes) * 100).toFixed(1);
    console.log(`✓ ${r.to.replace(ROOT + "/", "")} — ${(r.beforeBytes/1024).toFixed(1)}KB → ${(r.afterBytes/1024).toFixed(1)}KB (-${pct}%)`);
  }
  console.log(`\nConverted ${results.length} files, saved ${(savedTotal/1024).toFixed(1)}KB total.`);

  const edits = await rewriteImports();
  console.log(`Updated import paths in ${edits} source files.`);
}

main().catch(e => { console.error(e); process.exit(1); });
