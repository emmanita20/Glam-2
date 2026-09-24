import { checkPassword, deleteMedia } from "../lib/store.js";
export default async function handler(req, res) {
  if (!checkPassword(req.headers["x-admin-password"])) return res.status(401).json({ error: "Wrong password" });
  await deleteMedia(req.body?.url);
  res.status(200).json({ ok: true });
}
