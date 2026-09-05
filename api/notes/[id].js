import mongoose from "mongoose";
import { Note, connectDB, json, readJson, toClient } from "../../lib/db.js";
import { rateLimit } from "../../lib/rate-limit.js";

export default async function handler(req, res) {
  if (!(await rateLimit(req, res))) return;

  const id = req.query.id;
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return json(res, 400, { message: "Invalid note id" });
  }

  try {
    await connectDB();
  } catch (error) {
    console.error("Database connection failed:", error);
    return json(res, error.status || 500, { message: error.message || "Database unavailable" });
  }

  try {
    if (req.method === "GET") {
      const note = await Note.findById(id);
      if (!note) return json(res, 404, { message: "Note not found" });
      return json(res, 200, toClient(note));
    }

    if (req.method === "PUT") {
      const body = await readJson(req);
      const patch = {};
      if (typeof body.title === "string") patch.title = body.title;
      if (typeof body.content === "string") patch.content = body.content;
      if (typeof body.color === "string") patch.color = body.color;
      if (typeof body.pinned === "boolean") patch.pinned = body.pinned;

      const note = await Note.findByIdAndUpdate(id, patch, { new: true });
      if (!note) return json(res, 404, { message: "Note not found" });
      return json(res, 200, toClient(note));
    }

    if (req.method === "DELETE") {
      const note = await Note.findByIdAndDelete(id);
      if (!note) return json(res, 404, { message: "Note not found" });
      return json(res, 200, { message: "Note deleted successfully", id });
    }

    res.setHeader("allow", "GET, PUT, DELETE");
    return json(res, 405, { message: "Method not allowed" });
  } catch (error) {
    console.error("Error in /api/notes/[id]", error);
    return json(res, 500, { message: "Server Error" });
  }
}
