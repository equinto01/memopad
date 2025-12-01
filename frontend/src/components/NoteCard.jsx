import { PenSquareIcon, Trash2Icon } from "lucide-react";
import { Link } from "react-router";
import { formatDate } from "../lib/utils";
import api from "../lib/axios";
import toast from "react-hot-toast";

const NoteCard = ({ note, setNotes }) => {
  const handleDelete = async (e, id) => {
    e.preventDefault();
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    try {
      await api.delete(`/notes/${id}`);
      setNotes((prev) => prev.filter((note) => note._id !== id));
      toast.success("Note deleted succesfully");
    } catch (error) {
      console.log("Error in handleDelete", error);
      toast.error("Failed to delete note");
    }
  };
  return (
    <Link
      to={`/note/${note._id}`}
      className='card bg-base-200 card-interactive hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 border-2 border-primary/30 group relative overflow-hidden transform hover:-rotate-1 hover:scale-105'
      style={{
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.2)',
      }}
    >
      <div className='absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent group-hover:from-primary/20 transition-all duration-300' />
      <div className='card-body relative z-10 text-base-content'>
        <h3 className='card-title text-base-content group-hover:text-primary transition-colors font-bold'>{note.title}</h3>
        <p className='text-base-content/70 line-clamp-3 group-hover:text-base-content/90 transition-colors'>{note.content}</p>
        <div className='card-actions justify-between items-center mt-4'>
          <span className='text-sm text-base-content/60 group-hover:text-base-content/80 transition-colors'>
            {formatDate(new Date(note.createdAt))}
          </span>
          <div className='flex items-center gap-1'>
            <PenSquareIcon className='size-4 text-base-content/70 group-hover:scale-110 transition-transform' />
            <button
              className='btn btn-ghost btn-xs text-error hover:bg-error/20 hover:scale-110 transition-all'
              onClick={(e) => handleDelete(e, note._id)}
            >
              <Trash2Icon className='size-4' />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default NoteCard;
