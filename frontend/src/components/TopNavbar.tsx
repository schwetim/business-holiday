import React, { useState } from 'react';
import Link from 'next/link';

const TopNavbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold">
          ExtendMyTrip.com
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/events" className="hover:underline">
            Explore Events
          </Link>
          <Link href="/recommended-trips" className="hover:underline">
            Recommended Trips
          </Link>
          <button className="bg-white text-purple-700 px-4 py-2 rounded-md hover:bg-gray-200 transition duration-300">
            User Login
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-white focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-purple-700 px-4 pt-2 pb-4 space-y-2">
          <Link href="/events" className="block text-white hover:underline" onClick={toggleMenu}>
            Explore Events
          </Link>
          <Link href="/recommended-trips" className="block text-white hover:underline" onClick={toggleMenu}>
            Recommended Trips
          </Link>
          <button className="block w-full text-left bg-white text-purple-700 px-4 py-2 rounded-md hover:bg-gray-200 transition duration-300" onClick={toggleMenu}>
            User Login
          </button>
        </div>
      )}
    </nav>
  );
};

export default TopNavbar;
