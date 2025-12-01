import React from "react";
import { Link, useLocation } from "react-router";
import { PlusIcon, HomeIcon, SparklesIcon } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  const isWelcomePage = location.pathname === "/";

  return (
    <header className='bg-base-200/90 backdrop-blur-md border-b-2 border-primary/30 sticky top-0 z-50 shadow-md'>
      <div className='mx-auto max-w-7xl p-4'>
        <div className='flex items-center justify-between'>
          <Link to="/" className='flex items-center gap-2 group'>
            <SparklesIcon className='size-6 text-primary group-hover:rotate-180 transition-transform duration-500' />
            <h1 className='text-3xl font-bold text-primary font-mono tracking-tight group-hover:scale-105 transition-transform' style={{
              textShadow: '0 0 10px rgba(0, 255, 255, 0.5), 0 0 20px rgba(0, 255, 255, 0.3)',
            }}>
              MemoPad
            </h1>
          </Link>
          <div className='flex items-center gap-4'>
            {!isWelcomePage && (
              <>
                <Link to="/notes" className='btn btn-ghost gap-2 hover:bg-primary/20 transition-all text-base-content'>
                  <HomeIcon className='size-4' />
                  <span>Home</span>
                </Link>
                <Link 
                  to="/create" 
                  className='btn gap-2 shadow-lg transform hover:scale-105 transition-all bg-primary hover:bg-primary/80 text-base-100 border-0'
                  style={{
                    boxShadow: '0 4px 15px rgba(0, 255, 255, 0.3)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 255, 255, 0.6), 0 0 40px rgba(0, 255, 255, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 255, 255, 0.3)';
                  }}
                >
                  <PlusIcon className='size-5' />
                  <span>New Note</span>
                </Link>
              </>
            )}
            {isWelcomePage && (
              <Link 
                to={"/notes"} 
                className='btn gap-2 shadow-lg transform hover:scale-105 transition-all bg-primary hover:bg-primary/80 text-base-100 border-0'
                style={{
                  boxShadow: '0 4px 15px rgba(0, 255, 255, 0.3)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 255, 255, 0.6), 0 0 40px rgba(0, 255, 255, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 255, 255, 0.3)';
                }}
              >
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
