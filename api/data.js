import { readData, saveData, checkPassword } from "../lib/store.js";
export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method === "GET") return res.status(200).json(await readData());
  if (req.method === "POST") {
    if (!checkPassword(req.headers["x-admin-password"])) return res.status(401).json({ error: "Wrong password" });
    const d = req.body;
    if (!d || typeof d !== "object") return res.status(400).json({ error: "Bad data" });
    await saveData(d);
    return res.status(200).json({ ok: true });
  }
  res.status(405).end();
}
