import { create } from "zustand";

export const NOTE_COLORS = ["linen", "sage", "clay", "sky", "ink"] as const;
export type NoteColor = (typeof NOTE_COLORS)[number];

export type Note = {
  id: string;
  title: string;
  content: string;
  color: NoteColor;
  pinned: boolean;
  createdAt: number;
  updatedAt: number;
};

type NotesState = {
  notes: Note[];
  initialized: boolean;
  loadError: string | null;
  loadNotes: () => Promise<void>;
  createNote: (color?: NoteColor) => Promise<Note>;
  updateNote: (id: string, patch: Partial<Pick<Note, "title" | "content" | "color" | "pinned">>) => void;
  deleteNote: (id: string) => Promise<string | undefined>;
  importNotes: (notes: Note[]) => Promise<number>;
};

const saveTimers = new Map<string, number>();

async function request<T>(input: string, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  const data = (await res.json().catch(() => ({}))) as T & { message?: string };
  if (!res.ok) {
    const err = new Error(data.message || `Request failed (${res.status})`);
    (err as Error & { status?: number }).status = res.status;
    throw err;
  }
  return data;
}

export function formatUpdated(ts: number) {
  const seconds = Math.max(0, Math.floor((Date.now() - ts) / 1000));
  if (seconds < 45) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(ts).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function wordCount(text: string) {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

export function sortNotes(notes: Note[]) {
  return [...notes].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return b.updatedAt - a.updatedAt;
  });
}

export function isNoteColor(value: unknown): value is NoteColor {
  return typeof value === "string" && (NOTE_COLORS as readonly string[]).includes(value);
}

export function parseImportedNotes(raw: unknown): Note[] | null {
  if (!Array.isArray(raw)) return null;
  const notes: Note[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const rec = item as Record<string, unknown>;
    if (typeof rec.title !== "string" || typeof rec.content !== "string") continue;
    notes.push({
      id: typeof rec.id === "string" ? rec.id : "",
      title: rec.title,
      content: rec.content,
      color: isNoteColor(rec.color) ? rec.color : "linen",
      pinned: Boolean(rec.pinned),
      createdAt: typeof rec.createdAt === "number" ? rec.createdAt : Date.now(),
      updatedAt: typeof rec.updatedAt === "number" ? rec.updatedAt : Date.now(),
    });
  }
  return notes.length > 0 ? notes : null;
}

function persistSoon(id: string, patch: Partial<Pick<Note, "title" | "content" | "color" | "pinned">>) {
  const existing = saveTimers.get(id);
  if (existing) window.clearTimeout(existing);
  const timer = window.setTimeout(() => {
    saveTimers.delete(id);
    void request<Note>(`/api/notes/${id}`, {
      method: "PUT",
      body: JSON.stringify(patch),
    }).catch((error) => {
      console.error(error);
    });
  }, 450);
  saveTimers.set(id, timer);
}

export const useNotes = create<NotesState>()((set, get) => ({
  notes: [],
  initialized: false,
  loadError: null,
  loadNotes: async () => {
    try {
      const notes = await request<Note[]>("/api/notes");
      set({ notes, initialized: true, loadError: null });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not load notes";
      set({ initialized: true, loadError: message });
    }
  },
  createNote: async (color = "linen") => {
    const empty = get().notes.find((n) => !n.title.trim() && !n.content.trim());
    if (empty) return empty;
    const note = await request<Note>("/api/notes", {
      method: "POST",
      body: JSON.stringify({ title: "", content: "", color, pinned: false }),
    });
    set({ notes: [note, ...get().notes] });
    return note;
  },
  updateNote: (id, patch) => {
    set({
      notes: get().notes.map((note) =>
        note.id === id ? { ...note, ...patch, updatedAt: Date.now() } : note,
      ),
    });
    persistSoon(id, patch);
  },
  deleteNote: async (id) => {
    const notes = get().notes;
    const index = notes.findIndex((note) => note.id === id);
    const next = notes[index + 1] ?? notes[index - 1];
    set({ notes: notes.filter((note) => note.id !== id) });
    const existing = saveTimers.get(id);
    if (existing) window.clearTimeout(existing);
    saveTimers.delete(id);
    await request(`/api/notes/${id}`, { method: "DELETE" });
    return next?.id;
  },
  importNotes: async (incoming) => {
    let added = 0;
    for (const note of incoming) {
      await request<Note>("/api/notes", {
        method: "POST",
        body: JSON.stringify({
          title: note.title,
          content: note.content,
          color: note.color,
          pinned: note.pinned,
        }),
      });
      added += 1;
    }
    await get().loadNotes();
    return added;
  },
}));
