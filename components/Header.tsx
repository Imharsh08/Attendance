
import React from 'react';
import { SheetIcon } from './icons/SheetIcon';

const Header: React.FC = () => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <SheetIcon />
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white ml-3">
              Daily Attendance Sheet
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
