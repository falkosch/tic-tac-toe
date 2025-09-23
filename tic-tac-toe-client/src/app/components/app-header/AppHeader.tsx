import { type FC, type PropsWithChildren, useState } from 'react';

import logo from './logo.svg';

export const AppHeader: FC<PropsWithChildren> = ({ children = undefined }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="flex justify-between gap-5 bg-white px-5 shadow-lg shadow-indigo-300 md:justify-start">
      <a
        className="flex items-center gap-1 text-xl"
        href="https://github.com/falkosch/tic-tac-toe-azure"
      >
        <img width="32" height="32" src={logo} alt="logo" />
        <span>
          <span className="text-green-700">Tic</span>
          <span className="text-blue-700">Tac</span>
          <span className="text-red-700">Toe</span>
        </span>
      </a>
      <nav>
        <div className="flex h-16 items-center">
          <div className="hidden items-center gap-3 md:flex">{children}</div>
          <button
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
            }}
            className="rounded-md p-2 text-gray-700 hover:bg-gray-300 hover:text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-inset md:hidden"
            aria-controls="mobile-menu"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            <svg className="h-6 w-6" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
              />
            </svg>
          </button>
        </div>
        <div
          className={`${isMenuOpen ? 'block' : 'hidden'} fixed top-14 right-0 left-1/4 flex flex-col gap-3 bg-gradient-to-bl from-gray-100 to-gray-300 p-5 md:hidden`}
        >
          {children}
        </div>
      </nav>
    </header>
  );
};
