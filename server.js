// Local development server that mimics Vercel (not deployed).
import http from "http"; import fs from "fs"; import path from "path"; import { URL } from "url";
const TYPES = { ".html":"text/html", ".js":"text/javascript", ".json":"application/json", ".css":"text/css",
  ".png":"image/png", ".jpg":"image/jpeg", ".jpeg":"image/jpeg", ".webp":"image/webp", ".gif":"image/gif", ".mp4":"video/mp4", ".mov":"video/quicktime", ".svg":"image/svg+xml" };
http.createServer(async (req, res) => {
  const u = new URL(req.url, "http://x");
  res.status = c => { res.statusCode = c; return res; };
  res.json = o => { res.setHeader("Content-Type", "application/json"); res.end(JSON.stringify(o)); };
  req.query = Object.fromEntries(u.searchParams);
  if (u.pathname.startsWith("/api/")) {
    try {
      const mod = await import("./api/" + u.pathname.slice(5).replace(/\W/g, "") + ".js");
      if ((req.headers["content-type"] || "").includes("application/json")) {
        let b = ""; for await (const c of req) b += c; req.body = b ? JSON.parse(b) : {};
      }
      return await mod.default(req, res);
    } catch (e) { console.error(e); return res.status(500).json({ error: e.message }); }
  }
  let p = u.pathname === "/" ? "/index.html" : u.pathname === "/admin" ? "/admin.html" : u.pathname;
  const f = path.join(process.cwd(), decodeURIComponent(p));
  fs.readFile(f, (err, data) => {
    if (err) { res.statusCode = 404; return res.end("Not found"); }
    res.setHeader("Content-Type", TYPES[path.extname(f).toLowerCase()] || "application/octet-stream");
    res.end(data);
  });
}).listen(8080, "0.0.0.0", () => console.log("Dev server on :8080  (admin password: admin123)"));
