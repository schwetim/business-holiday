import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { api } from '../services/api'; // Import api service
import { SearchResults, Event, Category, Tag } from '../types'; // Import types
import { useAuth } from '@/context/AuthContext'; // Import useAuth hook

const RECENT_SEARCHES_STORAGE_KEY = 'recentSearches';
const MAX_RECENT_SEARCHES = 5;
const SEARCH_DEBOUNCE_DELAY = 300; // milliseconds

// Simple debounce function
const debounce = (func: (...args: any[]) => void, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

const TopNavbar: React.FC = () => {
  const { isAuthenticated, toggleAuth } = useAuth(); // Use the auth hook
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownResults, setDropdownResults] = useState<SearchResults | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1); // For keyboard navigation
  const [loading, setLoading] = useState(false); // Add loading state
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load recent searches from local storage on component mount
  useEffect(() => {
    const storedSearches = localStorage.getItem(RECENT_SEARCHES_STORAGE_KEY);
    if (storedSearches) {
      setRecentSearches(JSON.parse(storedSearches));
    }
  }, []);

  // Save recent searches to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem(RECENT_SEARCHES_STORAGE_KEY, JSON.stringify(recentSearches));
  }, [recentSearches]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (!isMenuOpen) {
      setIsSearchOpen(false); // Close search when opening mobile menu
    }
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setIsMenuOpen(false); // Close mobile menu when opening search
      setSearchQuery(''); // Clear search query when closing
      setDropdownResults(null); // Clear dropdown results
      setHighlightedIndex(-1); // Reset highlight
      // Focus the input when opening search on desktop
      if (window.innerWidth >= 768 && searchInputRef.current) {
        setTimeout(() => searchInputRef.current?.focus(), 0);
      }
    }
  };

  // Debounced search API call for dropdown
  const debouncedSearch = useRef(
    debounce(async (query: string) => {
      if (query.trim().length > 1) { // Only search if query is at least 2 characters
        setLoading(true); // Set loading to true
        try {
          // TODO: Modify backend API to accept limit parameters for dropdown
          // For now, fetching all and slicing on frontend (not ideal for large datasets)
          const data = await api.search(query);
          setDropdownResults({
            events: data.events.slice(0, 3), // Limit events in dropdown
            categories: data.categories.slice(0, 3), // Limit categories
            tags: data.tags.slice(0, 3), // Limit tags
            recentSearches: [], // Recent searches handled separately
          });
        } catch (error) {
          console.error('Failed to fetch dropdown search results:', error);
          setDropdownResults(null);
        } finally {
          setLoading(false); // Set loading to false
        }
      } else {
        setDropdownResults(null); // Clear results if query is too short
        setLoading(false); // Set loading to false
      }
    }, SEARCH_DEBOUNCE_DELAY)
  ).current;

  useEffect(() => {
    if (searchQuery) {
      debouncedSearch(searchQuery);
    } else {
      setDropdownResults(null); // Clear results when query is empty
    }
  }, [searchQuery, debouncedSearch]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (searchQuery.trim()) {
      // Add query to recent searches
      setRecentSearches(prevSearches => {
        const newSearches = [searchQuery.trim(), ...prevSearches.filter(s => s !== searchQuery.trim())];
        return newSearches.slice(0, MAX_RECENT_SEARCHES);
      });
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false); // Close search after navigating
      setSearchQuery(''); // Clear search query
      setDropdownResults(null); // Clear dropdown results
      setHighlightedIndex(-1); // Reset highlight
    }
  };

  const handleDropdownItemClick = (itemQuery: string) => {
    setSearchQuery(itemQuery); // Set search query to the clicked item's query
    handleSearchSubmit(); // Trigger search submit
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isSearchOpen || !dropdownRef.current) return;

      const items = dropdownRef.current.querySelectorAll('div[role="button"], li > button');
      const itemCount = items.length;

      if (itemCount === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightedIndex(prevIndex => (prevIndex + 1) % itemCount);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightedIndex(prevIndex => (prevIndex - 1 + itemCount) % itemCount);
      } else if (e.key === 'Enter') {
        if (highlightedIndex !== -1) {
          e.preventDefault();
          (items[highlightedIndex] as HTMLElement).click();
        } else if (searchQuery.trim()) {
           // If no item is highlighted, submit the search form
           handleSearchSubmit();
        }
      } else if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setSearchQuery('');
        setDropdownResults(null);
        setHighlightedIndex(-1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSearchOpen, dropdownResults, searchQuery, highlightedIndex]); // Add dependencies

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          searchInputRef.current && !searchInputRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
        setDropdownResults(null);
        setHighlightedIndex(-1);
      }
    };

    if (isSearchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchOpen]);


  const renderDropdownContent = () => {
    const hasDropdownResults = dropdownResults && (dropdownResults.events.length > 0 || dropdownResults.categories.length > 0 || dropdownResults.tags.length > 0);

    if (searchQuery.trim() === '') {
      // Show recent searches if query is empty
      if (recentSearches.length > 0) {
        return (
          <div className="p-2 text-gray-900">
            <div className="text-sm font-semibold mb-1">Recent Searches</div>
            <ul>
              {recentSearches.map((search, index) => (
                <li key={index}>
                  <button
                    role="button" // Added role for keyboard navigation
                    className={`block w-full text-left p-1 text-sm hover:bg-gray-100 rounded ${highlightedIndex === index ? 'bg-gray-200' : ''}`}
                    onClick={() => handleDropdownItemClick(search)}
                  >
                    {search}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        );
      } else {
        return <div className="p-2 text-sm text-gray-500">Start typing to search...</div>;
      }
    }

    if (loading) {
      return <div className="p-2 text-sm text-gray-500">Searching...</div>;
    }

    if (!hasDropdownResults) {
      return <div className="p-2 text-sm text-gray-500">No quick results found. Press Enter for full search.</div>;
    }

    // Render matching results
    let itemIndex = 0; // To track index for keyboard navigation

    return (
      <div className="p-2 text-gray-900 max-h-60 overflow-y-auto">
        {dropdownResults.events.length > 0 && (
          <div className="mb-2">
            <div className="text-sm font-semibold mb-1">Events</div>
            {dropdownResults.events.map((event: Event) => (
              <div
                key={event.id}
                role="button" // Added role for keyboard navigation
                className={`p-1 text-sm hover:bg-gray-100 rounded cursor-pointer ${highlightedIndex === itemIndex++ ? 'bg-gray-200' : ''}`}
                onClick={() => handleDropdownItemClick(event.name)} // Search by event name
              >
                {event.name} <span className="text-gray-500 text-xs">in {event.city}</span>
              </div>
            ))}
          </div>
        )}
        {dropdownResults.categories.length > 0 && (
           <div className="mb-2">
             <div className="text-sm font-semibold mb-1">Categories</div>
             {dropdownResults.categories.map((category: Category) => (
               <div
                 key={category.id}
                 role="button" // Added role for keyboard navigation
                 className={`p-1 text-sm hover:bg-gray-100 rounded cursor-pointer ${highlightedIndex === itemIndex++ ? 'bg-gray-200' : ''}`}
                 onClick={() => handleDropdownItemClick(category.name)} // Search by category name
               >
                 {category.name}
               </div>
             ))}
           </div>
         )}
         {dropdownResults.tags.length > 0 && (
            <div className="mb-2">
              <div className="text-sm font-semibold mb-1">Tags</div>
              {dropdownResults.tags.map((tag: Tag) => (
                <div
                  key={tag.id}
                  role="button" // Added role for keyboard navigation
                  className={`p-1 text-sm hover:bg-gray-100 rounded cursor-pointer ${highlightedIndex === itemIndex++ ? 'bg-gray-200' : ''}`}
                  onClick={() => handleDropdownItemClick(tag.name)} // Search by tag name
                >
                  {tag.name}
                </div>
              ))}
            </div>
          )}
      </div>
    );
  };


  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center"> {/* Use flex to align image and text if needed */}
          <img src="/images/BH_logo_128X128.png" alt="Business Holiday Booking Logo" className="h-8 w-auto" /> {/* Adjust size as needed */}
          {/* Optional: Add text next to logo if desired */}
          {/* <span className="ml-2 text-xl font-bold">ExtendMyTrip.com</span> */}
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6 relative">
          <Link href="/events" className="hover:underline">
            Explore Events
          </Link>
          <Link href="/recommended-trips" className="hover:underline">
            Recommended Trips
          </Link>
          {/* Search Icon */}
          <button onClick={toggleSearch} className="text-white focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </button>
          {/* Search Input and Dropdown */}
          {isSearchOpen && (
            <div ref={dropdownRef} className="absolute top-full right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-50">
              <form onSubmit={handleSearchSubmit} className="p-2">
                <input
                  ref={searchInputRef} // Attach ref
                  type="text"
                  placeholder="Search events, tags, categories..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchOpen(true)} // Keep dropdown open on focus
                  onBlur={() => setTimeout(() => setIsSearchOpen(false), 100)} // Close dropdown on blur (with delay)
                />
              </form>
              {/* Search Results Dropdown */}
              {(searchQuery.trim() !== '' || recentSearches.length > 0) && isSearchOpen && (
                 <div className="border-t border-gray-200">
                   {renderDropdownContent()}
                 </div>
               )}
            </div>
          )}
          {/* Auth Toggle Button (for testing) */}
          <button
            onClick={toggleAuth}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition duration-300 text-sm"
          >
            {isAuthenticated ? 'Logout (Test)' : 'Login (Test)'}
          </button>
          {/* User Authentication */}
          {isAuthenticated ? (
            // User Dropdown (Placeholder)
            <div className="relative"> {/* Added relative positioning for dropdown */}
              {/* User Avatar Placeholder */}
              <button className="flex items-center text-white focus:outline-none"> {/* Made avatar clickable */}
                {/* Replace with actual user avatar */}
                <svg className="w-8 h-8 text-gray-200 rounded-full overflow-hidden bg-gray-700" fill="currentColor" viewBox="0 0 24 24"> {/* Added styling */}
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </button>
              {/* Dropdown Menu (Placeholder) */}
              {/* This will be conditionally rendered based on a state variable */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"> {/* Added absolute positioning and styling */}
                <Link href="/account/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Profile
                </Link>
                <Link href="/account/saved-trips" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Saved Trips
                </Link>
                <button onClick={() => alert('Logout clicked!')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Logout
                </button>
              </div>
            </div>
          ) : (
            // Login Button
            <button className="bg-white text-purple-700 px-4 py-2 rounded-md hover:bg-gray-200 transition duration-300">
              User Login
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
           {/* Search Icon for Mobile */}
           <button onClick={toggleSearch} className="text-white focus:outline-none mr-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </button>
          <button onClick={toggleMenu} className="text-white focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-purple-700 px-4 pt-2 pb-4 space-y-2">
           {/* Search Input for Mobile */}
           <form onSubmit={handleSearchSubmit} className="mb-4">
            <input
              type="text"
              placeholder="Search events, tags, categories..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchOpen(true)} // Keep dropdown open on focus
              onBlur={() => setTimeout(() => setIsSearchOpen(false), 100)} // Close dropdown on blur (with delay)
            />
          </form>
          {/* Search Results Dropdown for Mobile (within the menu) */}
          {(searchQuery.trim() !== '' || recentSearches.length > 0) && isSearchOpen && (
             <div className="bg-white rounded-md shadow-lg text-gray-900">
               {renderDropdownContent()}
             </div>
           )}
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
       {/* Search Input and Dropdown for Mobile (appears below navbar when search is open, outside menu) */}
       {/* This section is removed as the mobile search is now within the menu */}
    </nav>
  );
};

export default TopNavbar;
