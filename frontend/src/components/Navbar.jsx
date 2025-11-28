import React from "react";
import { Link, useLocation } from "react-router";
import { PlusIcon, HomeIcon, SparklesIcon } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  const isWelcomePage = location.pathname === "/";

  return (
    <header className='bg-base-300/80 backdrop-blur-md border-b border-base-content/10 sticky top-0 z-50 shadow-lg'>
      <div className='mx-auto max-w-7xl p-4'>
        <div className='flex items-center justify-between'>
          <Link to="/" className='flex items-center gap-2 group'>
            <SparklesIcon className='size-6 text-primary group-hover:rotate-180 transition-transform duration-500' />
            <h1 className='text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-mono tracking-tight group-hover:scale-105 transition-transform'>
              MemoPad
            </h1>
          </Link>
          <div className='flex items-center gap-4'>
            {!isWelcomePage && (
              <>
                <Link to={"/notes"} className='btn btn-ghost gap-2 hover:bg-primary/10 transition-all'>
                  <HomeIcon className='size-4' />
                  <span>Home</span>
                </Link>
                <Link to={"/create"} className='btn btn-primary gap-2 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all'>
                  <PlusIcon className='size-5' />
                  <span>New Note</span>
                </Link>
              </>
            )}
            {isWelcomePage && (
              <Link to={"/notes"} className='btn btn-primary gap-2 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all'>
                <span>Get Started</span>
                <PlusIcon className='size-5' />
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
