import { NotebookIcon, SparklesIcon } from "lucide-react";
import { Link } from "react-router";

const NotesNotFound = () => {
  return (
    <div className='flex flex-col items-center justify-center py-16 space-y-6 max-w-md mx-auto text-center animate-fade-in-up'>
      <div className='relative'>
        <div className='bg-yellow-200 rounded-full p-8 animate-pulse-glow'>
          <NotebookIcon className='size-12 text-yellow-900' />
        </div>
        <SparklesIcon className='size-6 text-amber-600 absolute -top-2 -right-2 animate-pulse' />
      </div>
      <h3 className='text-3xl font-bold text-yellow-900'>
        No notes yet
      </h3>
      <p className='text-gray-700 text-lg'>
        Ready to organize your thoughts? Create your first note to get started
        on your journey.
      </p>
      <Link 
        to='/create' 
        className='btn btn-lg group shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all bg-yellow-500 hover:bg-yellow-600 text-gray-900 border-0'
      >
        <SparklesIcon className='size-5 group-hover:rotate-180 transition-transform duration-500' />
        Create Your First Note
      </Link>
    </div>
  );
};
export default NotesNotFound;
