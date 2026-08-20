// Assemble the Thinkific deliverable from the Vite single-file build.
// 1) Relativize the only root-absolute runtime URLs (/media/*, /logo.png).
// 2) Copy exactly the media the app references (closure), preserving any
//    subdirectories, plus the logo.
// 3) Leave index.html at the deliverable ROOT (no parent folder).
//
// Media may live in per-video subfolders (public/media/claims-01-av1/…) so the
// 267-video catalog isn't one flat directory. The closure therefore matches
// nested paths and mirrors them into the package rather than flattening them —
// flattening would collide the moment two videos both ship an `intro.mp4`.
import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  copyFileSync,
  readdirSync,
  rmSync,
  existsSync,
  statSync,
} from "node:fs";
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
// Matches `media/name.ext` AND `media/sub/dir/name.ext`. A trailing extension is
// required so a bare directory constant (e.g. "media/claims-01-av1") is not
// mistaken for a file. Asset URLs must appear as LITERALS in the built output —
// a path assembled at runtime from a base + id cannot be discovered here, which
// is why the lesson data carries full literal URLs.
const MEDIA_REF = /(?:["'`(])media\/((?:[A-Za-z0-9_.-]+\/)*[A-Za-z0-9_.-]+\.[A-Za-z0-9]{2,5})/g;
const referenced = new Set([...html.matchAll(MEDIA_REF)].map((m) => m[1]));
const logos = [
  ...html.matchAll(/(?:["'`(])(eximious-academy-logo(?:-reverse)?\.png)/g),
].map((m) => m[1]);

// Refuse anything that could escape the media root.
const unsafe = [...referenced].filter(
  (f) => f.split("/").includes("..") || path.isAbsolute(f),
);
if (unsafe.length) {
  console.error("!! UNSAFE media reference(s):", unsafe.join(", "));
  process.exit(1);
}

// --- 2) (re)build the deliverable dir ---
if (existsSync(outDir)) rmSync(outDir, { recursive: true, force: true });
mkdirSync(path.join(outDir, "media"), { recursive: true });
writeFileSync(path.join(outDir, "index.html"), html, "utf8");

let copied = 0;
const missing = [];
const notAFile = [];
const nested = new Set();

for (const f of referenced) {
  const src = path.join(publicDir, "media", f);
  if (!existsSync(src)) {
    missing.push(f);
    continue;
  }
  if (!statSync(src).isFile()) {
    notAFile.push(f);
    continue;
  }
  const dest = path.join(outDir, "media", f);
  mkdirSync(path.dirname(dest), { recursive: true }); // preserve subdirectories
  copyFileSync(src, dest);
  if (f.includes("/")) nested.add(path.dirname(f));
  copied++;
}

for (const l of new Set(logos)) {
  const src = path.join(publicDir, l);
  if (existsSync(src)) copyFileSync(src, path.join(outDir, l));
  else missing.push(l);
}

// --- 3) verify: every referenced asset exists in the package, byte-identical ---
const mismatched = [];
for (const f of referenced) {
  const src = path.join(publicDir, "media", f);
  const dest = path.join(outDir, "media", f);
  if (!existsSync(dest)) continue; // already reported as missing / not-a-file
  if (statSync(src).size !== statSync(dest).size) mismatched.push(f);
}

// --- report ---
const walkSize = (d) => {
  let total = 0;
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const fp = path.join(d, e.name);
    if (e.isDirectory()) total += walkSize(fp);
    else total += statSync(fp).size;
  }
  return total;
};
const mb = (n) => (n / 1024 / 1024).toFixed(1) + " MB";

console.log(
  "relativized /media/ refs:", beforeMedia,
  "-> stray root-absolute left:", afterMediaAbs,
  "| relative media/ refs:", relMedia,
);
console.log("logos referenced:", [...new Set(logos)].join(", ") || "(none)");
console.log("media subdirectories preserved:", [...nested].join(", ") || "(none)");
console.log("media files copied:", copied, "of", referenced.size, "referenced");
console.log("deliverable dir:", outDir);
console.log("index.html at root:", existsSync(path.join(outDir, "index.html")));
console.log("package size:", mb(walkSize(outDir)));

let failed = false;
if (missing.length) {
  console.error("!! MISSING (referenced but not found in public/):", missing.join(", "));
  failed = true;
}
if (notAFile.length) {
  console.error("!! NOT A FILE (referenced path is a directory):", notAFile.join(", "));
  failed = true;
}
if (mismatched.length) {
  console.error("!! SIZE MISMATCH after copy:", mismatched.join(", "));
  failed = true;
}
if (afterMediaAbs > 0) {
  console.error("!! root-absolute /media/ URLs remain — the package will not resolve on Thinkific");
  failed = true;
}
if (referenced.size === 0) {
  console.error("!! no media references found — the closure scan matched nothing");
  failed = true;
}
if (failed) process.exit(1);

console.log("\nOK — every referenced asset resolves inside the package.");
