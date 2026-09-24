// Production: issues secure Vercel Blob upload tokens (supports big videos).
// Local dev: receives the raw file and saves it to /local-data.
import { checkPassword, MODE } from "../lib/store.js";
import fs from "fs/promises";
import path from "path";

export const config = { api: { bodyParser: MODE === "blob" } };

export default async function handler(req, res) {
  if (MODE === "blob") {
    const { handleUpload } = await import("@vercel/blob/client");
    try {
      const json = await handleUpload({
        body: req.body,
        request: req,
        onBeforeGenerateToken: async (pathname, clientPayload) => {
          if (!checkPassword(clientPayload)) throw new Error("Wrong password");
          return {
            allowedContentTypes: ["image/*", "video/*"],
            addRandomSuffix: true,
            maximumSizeInBytes: 200 * 1024 * 1024,
          };
        },
        onUploadCompleted: async () => {},
      });
      return res.status(200).json(json);
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
  }
  // local
  if (!checkPassword(req.headers["x-admin-password"])) return res.status(401).json({ error: "Wrong password" });
  const name = Date.now() + "-" + String(req.query?.name || "file").replace(/[^\w.-]/g, "_");
  const chunks = []; for await (const c of req) chunks.push(c);
  const dir = path.join(process.cwd(), "local-data", "media");
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, name), Buffer.concat(chunks));
  res.status(200).json({ url: "/local-data/media/" + name });
}
