import type { RefObject } from "react";
import { NotebookPen, Pin, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { formatUpdated, NOTE_COLORS, sortNotes, type Note, type NoteColor } from "@/lib/notes-store";

type Props = {
  notes: Note[];
  selectedId?: string;
  query: string;
  colorFilter: NoteColor | "all";
  onQuery: (value: string) => void;
  onColorFilter: (value: NoteColor | "all") => void;
  onSelect: (id: string) => void;
  onCreate: () => void;
  searchRef: RefObject<HTMLInputElement | null>;
};

export function NoteSidebar({
  notes,
  selectedId,
  query,
  colorFilter,
  onQuery,
  onColorFilter,
  onSelect,
  onCreate,
  searchRef,
}: Props) {
  const filtered = sortNotes(
    notes.filter((note) => {
      if (colorFilter !== "all" && note.color !== colorFilter) return false;
      if (!query.trim()) return true;
      const hay = `${note.title} ${note.content}`.toLowerCase();
      return hay.includes(query.trim().toLowerCase());
    }),
  );

  return (
    <div className="flex h-full min-h-0 flex-col bg-card">
      <div className="flex items-center gap-2 border-b border-border px-3 py-3">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
          <Input
            ref={searchRef}
            value={query}
            onChange={(event) => onQuery(event.target.value)}
            placeholder="Search  ⌘K"
            aria-label="Search notes"
            className="h-11 rounded-full border-border bg-background pl-9"
          />
        </div>
        <Button onClick={onCreate} className="shrink-0 px-3.5" aria-label="New note">
          <Plus />
          <span className="hidden sm:inline">New</span>
        </Button>
      </div>

      <div className="flex items-center gap-1 overflow-x-auto border-b border-border px-3 py-2" role="radiogroup" aria-label="Filter by color">
        <FilterChip selected={colorFilter === "all"} onSelect={() => onColorFilter("all")}>
          All
        </FilterChip>
        {NOTE_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            role="radio"
            aria-checked={colorFilter === color}
            aria-label={`Filter ${color}`}
            onClick={() => onColorFilter(colorFilter === color ? "all" : color)}
            className="flex size-9 shrink-0 items-center justify-center rounded-full"
          >
            <span
              data-swatch={color}
              className={cn(
                "block size-4 rounded-full",
                colorFilter === color ? "ring-2 ring-foreground" : "ring-1 ring-foreground/30",
              )}
            />
          </button>
        ))}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        {filtered.length === 0 ? (
          <div className="px-3 py-10 text-center">
            <NotebookPen className="mx-auto size-6 text-muted" />
            <p className="mt-3 text-sm text-muted">
              {query.trim() || colorFilter !== "all" ? "No notes match that filter." : "No notes yet."}
            </p>
            {!query.trim() && colorFilter === "all" ? (
              <Button className="mt-4" size="sm" onClick={onCreate}>
                Write one
              </Button>
            ) : null}
          </div>
        ) : (
          <ul className="flex flex-col gap-1">
            {filtered.map((note) => {
              const selected = note.id === selectedId;
              return (
                <li key={note.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(note.id)}
                    className={cn(
                      "flex w-full items-start gap-3 rounded-lg px-3 py-3 text-left transition-colors duration-150",
                      selected ? "bg-secondary" : "hover:bg-accent",
                    )}
                  >
                    <span
                      data-swatch={note.color}
                      className="mt-1.5 size-2.5 shrink-0 rounded-full"
                      aria-hidden
                    />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="truncate font-medium">
                          {note.title.trim() || "Untitled"}
                        </span>
                        {note.pinned ? (
                          <Pin className="size-3.5 shrink-0 text-muted" aria-label="Pinned" />
                        ) : null}
                      </span>
                      <span className="mt-0.5 line-clamp-2 text-sm text-muted">
                        {note.content.trim() || "Empty note"}
                      </span>
                      <span className="mt-1 block text-xs text-muted">
                        {formatUpdated(note.updatedAt)}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <p className="hidden border-t border-border px-4 py-2.5 text-xs text-muted md:block">
        N new note · Esc back
      </p>
    </div>
  );
}

function FilterChip({
  selected,
  onSelect,
  children,
}: {
  selected: boolean;
  onSelect: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={cn(
        "h-9 shrink-0 rounded-full px-3 text-xs font-medium",
        selected ? "bg-primary text-primary-foreground" : "bg-background text-muted hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
