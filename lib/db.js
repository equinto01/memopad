import mongoose from "mongoose";

const COLORS = ["linen", "sage", "clay", "sky", "ink"];

const noteSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    content: { type: String, default: "" },
    color: { type: String, enum: COLORS, default: "linen" },
    pinned: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Note = mongoose.models.Note || mongoose.model("Note", noteSchema);

const globalForMongoose = globalThis;

export async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    const err = new Error("MONGO_URI is not set");
    err.status = 503;
    throw err;
  }

  if (mongoose.connection.readyState === 1) return mongoose;

  if (!globalForMongoose.__mongoosePromise) {
    globalForMongoose.__mongoosePromise = mongoose.connect(uri, {
      bufferCommands: false,
    });
  }

  await globalForMongoose.__mongoosePromise;
  return mongoose;
}

export function toClient(doc) {
  const obj = typeof doc.toObject === "function" ? doc.toObject() : doc;
  const color = COLORS.includes(obj.color) ? obj.color : "linen";
  return {
    id: String(obj._id),
    title: obj.title ?? "",
    content: obj.content ?? "",
    color,
    pinned: Boolean(obj.pinned),
    createdAt: obj.createdAt ? new Date(obj.createdAt).getTime() : Date.now(),
    updatedAt: obj.updatedAt ? new Date(obj.updatedAt).getTime() : Date.now(),
  };
}

export function json(res, status, body) {
  res.statusCode = status;
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.setHeader("cache-control", "no-store");
  res.end(JSON.stringify(body));
}

export async function readJson(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (chunks.length === 0) return {};
  return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
}
