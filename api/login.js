import { checkPassword, setupProblem, MODE } from "../lib/store.js";
export default async function handler(req, res) {
  const problem = setupProblem();
  if (problem) return res.status(403).json({ error: problem });
  if (!checkPassword(req.body?.password)) return res.status(401).json({ error: "Wrong password. Check for typos and capital letters." });
  res.status(200).json({ ok: true, mode: MODE });
}
