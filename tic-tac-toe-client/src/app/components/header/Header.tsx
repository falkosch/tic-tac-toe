import React, { type FC, type PropsWithChildren, useState } from 'react';

import logo from './logo.svg';

import styles from './Header.module.css';

export const Header: FC<PropsWithChildren> = ({ children = undefined }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className={styles.header}>
      <nav className="fixed top-0 right-0 left-0 z-50 border-b border-gray-200 bg-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <a
              href="https://github.com/falkosch/tic-tac-toe-azure"
              className="flex items-center space-x-2"
            >
              <img className={`${styles.logo} inline-block`} src={logo} alt="logo" />
              <span className="font-medium text-gray-900">Tic Tac Toe Game</span>
            </a>

            <div className="md:hidden">
              <button
                onClick={() => {
                  setIsMenuOpen(!isMenuOpen);
                }}
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-200 hover:text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-inset"
                aria-controls="mobile-menu"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
                <svg
                  className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="hidden md:block">{children}</div>
          </div>

          <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`} id="mobile-menu">
            <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">{children}</div>
          </div>
        </div>
      </nav>
    </div>
  );
};
