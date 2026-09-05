import { useEffect, useRef, useState, type RefObject } from "react";
import { ArrowLeft, Download, Pin, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogActionButton,
  AlertDialogCancelButton,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import {
  formatUpdated,
  NOTE_COLORS,
  wordCount,
  type Note,
  type NoteColor,
} from "@/lib/notes-store";

type Props = {
  note: Note | undefined;
  onBack: () => void;
  onChange: (id: string, patch: Partial<Pick<Note, "title" | "content" | "color" | "pinned">>) => void;
  onDelete: (id: string) => void;
  titleRef: RefObject<HTMLInputElement | null>;
};

export function NoteEditor({ note, onBack, onChange, onDelete, titleRef }: Props) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!saving) return;
    const timer = window.setTimeout(() => setSaving(false), 700);
    return () => window.clearTimeout(timer);
  }, [saving, note?.updatedAt]);

  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.max(el.scrollHeight, 288)}px`;
  }, [note?.id, note?.content]);

  function patch(partial: Partial<Pick<Note, "title" | "content" | "color" | "pinned">>) {
    if (!note) return;
    setSaving(true);
    onChange(note.id, partial);
  }

  if (!note) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-8 text-center">
        <p className="font-display text-3xl tracking-tight">Pick a page</p>
        <p className="mt-2 max-w-sm text-muted">
          Select a note from the list, or press N to start a new one. Everything autosaves.
        </p>
      </div>
    );
  }

  const words = wordCount(note.content);

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <div className="flex items-center gap-1 border-b border-border px-2 py-2 md:px-4">
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 md:hidden"
          onClick={onBack}
          aria-label="Back to notes"
        >
          <ArrowLeft />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={cn("shrink-0", note.pinned && "bg-secondary")}
          onClick={() => patch({ pinned: !note.pinned })}
          aria-label={note.pinned ? "Unpin note" : "Pin note"}
        >
          <Pin className={cn("size-4", note.pinned && "fill-current")} />
        </Button>
        <div className="mx-1 hidden h-5 w-px shrink-0 bg-border sm:block" />
        <div className="flex min-w-0 items-center gap-0.5 overflow-x-auto" role="radiogroup" aria-label="Note color">
          {NOTE_COLORS.map((color) => (
            <ColorDot
              key={color}
              color={color}
              selected={note.color === color}
              onSelect={() => patch({ color })}
            />
          ))}
        </div>
        <p className="ml-auto hidden shrink-0 text-xs text-muted sm:block">
          {saving ? "Saving" : "Saved"}
        </p>
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0"
          onClick={() => downloadNote(note)}
          aria-label="Download this note"
        >
          <Download />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0"
          onClick={() => setConfirmOpen(true)}
          aria-label="Delete note"
        >
          <Trash2 />
        </Button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="note-sheet mx-auto flex min-h-full w-full max-w-2xl flex-col py-8 pr-6 pl-8 sm:px-12 sm:py-12">
          <input
            ref={titleRef}
            value={note.title}
            onChange={(event) => patch({ title: event.target.value })}
            placeholder="Untitled"
            aria-label="Note title"
            className="w-full bg-transparent font-display text-3xl leading-tight tracking-tight text-foreground outline-none placeholder:text-muted/60 sm:text-4xl"
          />
          <textarea
            ref={bodyRef}
            value={note.content}
            onChange={(event) => patch({ content: event.target.value })}
            placeholder="Start writing"
            aria-label="Note content"
            spellCheck
            className="mt-6 min-h-72 w-full resize-none bg-transparent text-base leading-relaxed text-foreground outline-none placeholder:text-muted/60"
          />
          <p className="mt-8 pb-4 text-xs text-muted">
            {words} {words === 1 ? "word" : "words"} · {formatUpdated(note.updatedAt)}
          </p>
        </div>
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this note?</AlertDialogTitle>
            <AlertDialogDescription>
              “{note.title.trim() || "Untitled"}” will be removed from this browser. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancelButton>Keep it</AlertDialogCancelButton>
            <AlertDialogActionButton
              onClick={() => {
                onDelete(note.id);
                setConfirmOpen(false);
              }}
            >
              Delete
            </AlertDialogActionButton>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function ColorDot({
  color,
  selected,
  onSelect,
}: {
  color: NoteColor;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={color}
      onClick={onSelect}
      className="flex size-9 shrink-0 items-center justify-center rounded-full"
    >
      <span
        data-swatch={color}
        className={cn(
          "block size-4 rounded-full",
          selected ? "ring-2 ring-foreground" : "ring-1 ring-foreground/30",
        )}
      />
    </button>
  );
}

function downloadNote(note: Note) {
  const title = note.title.trim() || "untitled";
  const blob = new Blob([`${note.title}\n\n${note.content}\n`], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${title.replace(/[^\w\s-]+/g, "").trim() || "untitled"}.txt`;
  anchor.click();
  URL.revokeObjectURL(url);
}
