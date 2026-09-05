import { create } from "zustand";
import { persist } from "zustand/middleware";

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
  ensureSeed: () => void;
  createNote: (color?: NoteColor) => Note;
  updateNote: (id: string, patch: Partial<Pick<Note, "title" | "content" | "color" | "pinned">>) => void;
  deleteNote: (id: string) => string | undefined;
  importNotes: (notes: Note[]) => number;
};

const SEED: Array<Pick<Note, "title" | "content" | "color" | "pinned">> = [
  {
    title: "Welcome to MemoPad",
    color: "sage",
    pinned: true,
    content:
      "This is your notebook. Notes save as you type — no accounts, no submit button.\n\nTry a few things:\n- Pin a note to keep it at the top\n- Color a note so you can find it later\n- Search with ⌘K or Ctrl+K\n- Press N for a new note (when you are not typing)\n- Download a backup, or restore one, from the header\n\nEverything stays in this browser until you export it.",
  },
  {
    title: "Scratch pad",
    color: "linen",
    pinned: false,
    content:
      "Loose thoughts, errands, a paragraph you want nearby.\n\nMemoPad is meant to feel like paper: quiet, a little warm, and ready when you are.",
  },
  {
    title: "Reading list",
    color: "sky",
    pinned: false,
    content:
      "— Designing Data-Intensive Applications\n— The Pragmatic Programmer\n— CSS for JavaScript Developers\n\nAdd the next thing you do not want to forget.",
  },
];

function uid() {
  return crypto.randomUUID();
}

function stamp(partial: Pick<Note, "title" | "content" | "color" | "pinned">): Note {
  const now = Date.now();
  return { id: uid(), createdAt: now, updatedAt: now, ...partial };
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
    if (typeof rec.id !== "string" || typeof rec.title !== "string" || typeof rec.content !== "string") {
      continue;
    }
    notes.push({
      id: rec.id,
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

export const useNotes = create<NotesState>()(
  persist(
    (set, get) => ({
      notes: [],
      initialized: false,
      ensureSeed: () => {
        if (get().initialized) return;
        if (get().notes.length === 0) {
          set({ notes: SEED.map(stamp), initialized: true });
          return;
        }
        set({ initialized: true });
      },
      createNote: (color = "linen") => {
        const empty = get().notes.find((n) => !n.title.trim() && !n.content.trim());
        if (empty) return empty;
        const note = stamp({ title: "", content: "", color, pinned: false });
        set({ notes: [note, ...get().notes] });
        return note;
      },
      updateNote: (id, patch) => {
        set({
          notes: get().notes.map((note) =>
            note.id === id ? { ...note, ...patch, updatedAt: Date.now() } : note,
          ),
        });
      },
      deleteNote: (id) => {
        const notes = get().notes;
        const index = notes.findIndex((note) => note.id === id);
        const next = notes[index + 1] ?? notes[index - 1];
        set({ notes: notes.filter((note) => note.id !== id) });
        return next?.id;
      },
      importNotes: (incoming) => {
        const byId = new Map(get().notes.map((note) => [note.id, note]));
        let added = 0;
        for (const note of incoming) {
          if (!byId.has(note.id)) added += 1;
          byId.set(note.id, note);
        }
        set({ notes: [...byId.values()], initialized: true });
        return added;
      },
    }),
    {
      name: "memopad.notes.v1",
      skipHydration: true,
      partialize: (state) => ({ notes: state.notes, initialized: state.initialized }),
    },
  ),
);
