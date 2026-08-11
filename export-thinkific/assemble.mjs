// Assemble the Thinkific deliverable from the Vite single-file build.
// 1) Relativize the only root-absolute runtime URLs (/media/*, /logo.png).
// 2) Copy exactly the media the app references (closure), plus the logo.
// 3) Leave index.html at the deliverable ROOT (no parent folder).
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, rmSync, existsSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(dir, "..");
const distHtml = path.join(dir, "dist", "index.html");
const publicDir = path.join(repo, "public");
const outName = "eximious-claims-investigation-thinkific-html5";
const outDir = path.join(repo, outName);

let html = readFileSync(distHtml, "utf8");

// --- 1) relativize (strip the leading slash so URLs resolve against index.html) ---
const beforeMedia = (html.match(/\/media\//g) || []).length;
html = html.replace(/(["'`(])\/media\//g, "$1media/");
html = html.replace(/(["'`(])\/(eximious-academy-logo(?:-reverse)?\.png)/g, "$1$2");
const afterMediaAbs = (html.match(/[^a-z]\/media\//g) || []).length; // stray root-absolute left?
const relMedia = (html.match(/(["'`(])media\//g) || []).length;

// --- collect the exact media closure the app now references ---
const referenced = new Set(
  [...html.matchAll(/(?:["'`(])media\/([a-zA-Z0-9_.-]+)/g)].map((m) => m[1]),
);
const logos = [...html.matchAll(/(?:["'`(])(eximious-academy-logo(?:-reverse)?\.png)/g)].map((m) => m[1]);

// --- 2) (re)build the deliverable dir ---
if (existsSync(outDir)) rmSync(outDir, { recursive: true, force: true });
mkdirSync(path.join(outDir, "media"), { recursive: true });
writeFileSync(path.join(outDir, "index.html"), html, "utf8");

let copied = 0, missing = [];
for (const f of referenced) {
  const src = path.join(publicDir, "media", f);
  if (existsSync(src)) { copyFileSync(src, path.join(outDir, "media", f)); copied++; }
  else missing.push(f);
}
for (const l of new Set(logos)) {
  const src = path.join(publicDir, l);
  if (existsSync(src)) copyFileSync(src, path.join(outDir, l));
  else missing.push(l);
}

// --- report ---
const size = (p) => { let t = 0; const walk = (d) => { for (const e of require("node:fs").readdirSync(d, { withFileTypes: true })) { const fp = path.join(d, e.name); e.isDirectory() ? walk(fp) : (t += statSync(fp).size); } }; walk(p); return t; };
console.log("relativized /media/ refs:", beforeMedia, "-> stray root-absolute left:", afterMediaAbs, "| relative media/ refs:", relMedia);
console.log("logos referenced:", [...new Set(logos)].join(", ") || "(none)");
console.log("media files copied:", copied, "of", referenced.size, "referenced");
if (missing.length) console.log("!! MISSING (referenced but not found in public/):", missing.join(", "));
console.log("deliverable dir:", outDir);
console.log("index.html at root:", existsSync(path.join(outDir, "index.html")));
