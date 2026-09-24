// Storage: Vercel Blob in production, local folder for development.
import { DEFAULT_DATA } from "./defaults.js";
import fs from "fs/promises";
import path from "path";

export const MODE = process.env.BLOB_READ_WRITE_TOKEN ? "blob" : "local";
const LOCAL_DIR = path.join(process.cwd(), "local-data");

const ON_VERCEL = !!process.env.VERCEL;
export function realPassword() {
  const env = (process.env.ADMIN_PASSWORD || "").trim();
  if (env) return env;
  return ON_VERCEL ? "" : "admin123"; // default only for local testing
}
export function checkPassword(pw) {
  const real = realPassword();
  return !!real && String(pw || "").trim() === real;
}
export function setupProblem() {
  if (!realPassword()) return "ADMIN_PASSWORD is not set on Vercel. Add it in Settings → Environment Variables, then Redeploy.";
  if (ON_VERCEL && MODE !== "blob") return "Blob storage is not connected. Go to Storage → Create → Blob (Public), connect it to this project, then Redeploy.";
  return "";
}

export async function readData() {
  try {
    if (MODE === "blob") {
      const { list } = await import("@vercel/blob");
      const { blobs } = await list({ prefix: "data/" });
      if (!blobs.length) return DEFAULT_DATA;
      blobs.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
      const r = await fetch(blobs[0].url, { cache: "no-store" });
      return { ...DEFAULT_DATA, ...(await r.json()) };
    }
    const txt = await fs.readFile(path.join(LOCAL_DIR, "card.json"), "utf8");
    return { ...DEFAULT_DATA, ...JSON.parse(txt) };
  } catch { return DEFAULT_DATA; }
}

export async function saveData(data) {
  const body = JSON.stringify(data);
  if (MODE === "blob") {
    const { put, list, del } = await import("@vercel/blob");
    const saved = await put("data/card.json", body, {
      access: "public", contentType: "application/json", addRandomSuffix: true });
    const { blobs } = await list({ prefix: "data/" });
    const old = blobs.filter(b => b.url !== saved.url).map(b => b.url);
    if (old.length) await del(old);
    return;
  }
  await fs.mkdir(LOCAL_DIR, { recursive: true });
  await fs.writeFile(path.join(LOCAL_DIR, "card.json"), body);
}

export async function deleteMedia(url) {
  if (!url) return;
  if (MODE === "blob" && url.includes("blob.vercel-storage.com")) {
    const { del } = await import("@vercel/blob"); await del(url).catch(() => {});
  } else if (url.startsWith("/local-data/")) {
    await fs.unlink(path.join(process.cwd(), url)).catch(() => {});
  }
}
