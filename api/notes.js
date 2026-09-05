import { Note, connectDB, json, readJson, toClient } from "../lib/db.js";
import { rateLimit } from "../lib/rate-limit.js";

export default async function handler(req, res) {
  if (!(await rateLimit(req, res))) return;

  try {
    await connectDB();
  } catch (error) {
    console.error("Database connection failed:", error);
    return json(res, error.status || 500, { message: error.message || "Database unavailable" });
  }

  try {
    if (req.method === "GET") {
      const notes = await Note.find().sort({ updatedAt: -1 });
      return json(res, 200, notes.map(toClient));
    }

    if (req.method === "POST") {
      const body = await readJson(req);
      const note = await Note.create({
        title: typeof body.title === "string" ? body.title : "",
        content: typeof body.content === "string" ? body.content : "",
        color: body.color,
        pinned: Boolean(body.pinned),
      });
      return json(res, 201, toClient(note));
    }

    res.setHeader("allow", "GET, POST");
    return json(res, 405, { message: "Method not allowed" });
  } catch (error) {
    console.error("Error in /api/notes", error);
    return json(res, 500, { message: "Server Error" });
  }
}
