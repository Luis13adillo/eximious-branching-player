/**
 * Static server for previewing the Thinkific package the way a CDN serves it.
 * python3 -m http.server is not a valid stand-in: it answers Range requests with
 * 200 + the whole file and handles one connection at a time, which stalls MP4
 * playback the moment the player has several videos in flight (a decision scene
 * preloads all four feedback clips).
 */
import { createServer } from "node:http";
import { createReadStream, statSync, existsSync } from "node:fs";
import { join, extname, normalize, resolve } from "node:path";

/**
 * ABSOLUTE, always. join() normalises "./EA_x" to "EA_x", so a relative ROOT makes the
 * containment guard below (`file.startsWith(ROOT)`) fail on every request and the server
 * answers 404 for the whole package - including for the exact "./EA_..." invocation the
 * real-device QA docs tell you to run.
 */
const ROOT = resolve(process.argv[2] || ".");
const PORT = Number(process.argv[3] || 8913);
const TYPES = {
  ".html": "text/html; charset=utf-8", ".mp4": "video/mp4", ".mp3": "audio/mpeg",
  ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml",
  ".css": "text/css", ".js": "text/javascript", ".json": "application/json",
};

createServer((req, res) => {
  const url = decodeURIComponent((req.url || "/").split("?")[0]);
  const rel = normalize(url === "/" ? "/index.html" : url).replace(/^(\.\.[/\\])+/, "");
  const file = join(ROOT, rel);
  if (!file.startsWith(ROOT) || !existsSync(file) || statSync(file).isDirectory()) {
    res.writeHead(404); return res.end("not found");
  }
  const size = statSync(file).size;
  const type = TYPES[extname(file).toLowerCase()] || "application/octet-stream";
  const range = req.headers.range;

  if (range) {
    const m = /bytes=(\d*)-(\d*)/.exec(range);
    const start = m[1] ? Number(m[1]) : 0;
    const end = m[2] ? Number(m[2]) : size - 1;
    if (start >= size || end >= size || start > end) {
      res.writeHead(416, { "Content-Range": `bytes */${size}` }); return res.end();
    }
    res.writeHead(206, {
      "Content-Range": `bytes ${start}-${end}/${size}`,
      "Accept-Ranges": "bytes",
      "Content-Length": end - start + 1,
      "Content-Type": type,
    });
    return createReadStream(file, { start, end }).pipe(res);
  }
  res.writeHead(200, { "Content-Length": size, "Content-Type": type, "Accept-Ranges": "bytes" });
  createReadStream(file).pipe(res);
}).listen(PORT, "0.0.0.0", () => console.log(`serving ${ROOT} on port ${PORT} (all interfaces — reachable from phones on this LAN)`));
