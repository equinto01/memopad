import { NotebookIcon, SparklesIcon } from "lucide-react";
import { Link } from "react-router";

const NotesNotFound = () => {
  return (
    <div className='flex flex-col items-center justify-center py-16 space-y-6 max-w-md mx-auto text-center animate-fade-in-up'>
      <div className='relative'>
        <div className='bg-primary/20 rounded-full p-8 animate-pulse-glow'>
          <NotebookIcon className='size-12 text-primary' />
        </div>
        <SparklesIcon className='size-6 text-accent absolute -top-2 -right-2 animate-pulse' />
      </div>
      <h3 className='text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent'>
        No notes yet
      </h3>
      <p className='text-base-content/70 text-lg'>
        Ready to organize your thoughts? Create your first note to get started
        on your journey.
      </p>
      <Link 
        to='/create' 
        className='btn btn-primary btn-lg group shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all'
      >
        <SparklesIcon className='size-5 group-hover:rotate-180 transition-transform duration-500' />
        Create Your First Note
      </Link>
    </div>
  );
};
export default NotesNotFound;
