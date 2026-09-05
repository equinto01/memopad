import { useEffect, useRef, useState } from "react";
import { Download, Moon, NotebookPen, Sun, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme";
import { NoteEditor } from "@/components/notes/note-editor";
import { NoteSidebar } from "@/components/notes/note-sidebar";
import { cn } from "@/lib/utils";
import {
  parseImportedNotes,
  sortNotes,
  useNotes,
  type Note,
  type NoteColor,
} from "@/lib/notes-store";

type Props = {
  selectedId?: string;
  onSelect: (id: string | undefined) => void;
};

export function MemoApp({ selectedId, onSelect }: Props) {
  const { theme, toggle } = useTheme();
  const notes = useNotes((s) => s.notes);
  const ensureSeed = useNotes((s) => s.ensureSeed);
  const createNote = useNotes((s) => s.createNote);
  const updateNote = useNotes((s) => s.updateNote);
  const deleteNote = useNotes((s) => s.deleteNote);
  const importNotes = useNotes((s) => s.importNotes);
  const [hydrated, setHydrated] = useState(false);
  const [query, setQuery] = useState("");
  const [colorFilter, setColorFilter] = useState<NoteColor | "all">("all");
  const searchRef = useRef<HTMLInputElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    void Promise.resolve(useNotes.persist.rehydrate()).then(() => {
      useNotes.getState().ensureSeed();
      setHydrated(true);
    });
  }, [ensureSeed]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const meta = event.metaKey || event.ctrlKey;
      const target = event.target as HTMLElement | null;
      const typing =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        Boolean(target?.isContentEditable);

      if (meta && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
        return;
      }
      if (meta && event.key.toLowerCase() === "s") {
        event.preventDefault();
        toast.success("Already saved");
        return;
      }
      if (event.key === "Escape") {
        if (typing) {
          (target as HTMLElement).blur();
          return;
        }
        if (window.matchMedia("(max-width: 767px)").matches) {
          onSelect(undefined);
        }
        return;
      }
      if (!typing && event.key.toLowerCase() === "n" && !meta && !event.altKey) {
        event.preventDefault();
        handleCreate();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const selected = notes.find((note) => note.id === selectedId);

  useEffect(() => {
    if (!hydrated || selectedId || notes.length === 0) return;
    if (!window.matchMedia("(min-width: 768px)").matches) return;
    onSelect(sortNotes(notes)[0]?.id);
  }, [hydrated, notes, onSelect, selectedId]);

  function handleCreate() {
    const note = createNote(colorFilter === "all" ? "linen" : colorFilter);
    onSelect(note.id);
    window.setTimeout(() => titleRef.current?.focus(), 30);
  }

  function handleDelete(id: string) {
    const next = deleteNote(id);
    setQuery("");
    onSelect(next);
    toast("Note deleted");
  }

  function downloadAll() {
    const payload = JSON.stringify(notes, null, 2);
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "memopad-backup.json";
    anchor.click();
    URL.revokeObjectURL(url);
    toast.success("Backup downloaded");
  }

  function onImportFile(file: File | undefined) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = parseImportedNotes(JSON.parse(String(reader.result)));
        if (!parsed) {
          toast.error("That file does not look like a MemoPad backup");
          return;
        }
        const added = importNotes(parsed);
        toast.success(added > 0 ? `Imported ${parsed.length} notes` : "Notes updated from backup");
      } catch {
        toast.error("Could not read that file");
      }
    };
    reader.readAsText(file);
  }

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background">
      <a
        href="#note-main"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-3 focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to note
      </a>
      <header className="flex shrink-0 items-center gap-3 border-b border-border bg-card px-3 py-2.5 sm:px-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <NotebookPen className="size-4" />
          </span>
          <div className="flex min-w-0 flex-col gap-0.5">
            <p className="font-display text-lg leading-tight tracking-tight">MemoPad</p>
            <p className="hidden text-xs leading-none text-muted sm:block">Quiet notes, autosaved</p>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            tabIndex={-1}
            aria-hidden
            onChange={(event) => {
              onImportFile(event.target.files?.[0]);
              event.target.value = "";
            }}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => fileRef.current?.click()}
            aria-label="Import notes backup"
          >
            <Upload />
          </Button>
          <Button variant="ghost" size="icon" onClick={downloadAll} aria-label="Download all notes">
            <Download />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
          >
            {theme === "dark" ? <Sun /> : <Moon />}
          </Button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <aside
          className={cn(
            "h-full w-full min-w-0 border-r border-border md:w-80 lg:w-96",
            selectedId ? "hidden md:block" : "block",
          )}
        >
          {hydrated ? (
            <NoteSidebar
              notes={notes}
              selectedId={selectedId}
              query={query}
              colorFilter={colorFilter}
              onQuery={setQuery}
              onColorFilter={setColorFilter}
              onSelect={onSelect}
              onCreate={handleCreate}
              searchRef={searchRef}
            />
          ) : (
            <SidebarSkeleton />
          )}
        </aside>
        <main
          id="note-main"
          className={cn("h-full min-w-0 flex-1", selectedId ? "block" : "hidden md:block")}
        >
          {hydrated ? (
            <NoteEditor
              note={selected}
              onBack={() => onSelect(undefined)}
              onChange={updateNote}
              onDelete={handleDelete}
              titleRef={titleRef}
            />
          ) : (
            <div className="h-full bg-background" />
          )}
        </main>
      </div>
    </div>
  );
}

function SidebarSkeleton() {
  return (
    <div className="flex h-full flex-col gap-2 p-4">
      <div className="h-11 rounded-full bg-secondary" />
      <div className="h-16 rounded-lg bg-secondary" />
      <div className="h-16 rounded-lg bg-secondary" />
      <div className="h-16 rounded-lg bg-secondary" />
    </div>
  );
}

export type { Note };
