import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { SearchResults, Event, Category, Tag } from '../types'; // Import SearchResults and other types
import { api } from '../services/api'; // Import api service
import EventCard from '../components/EventCard'; // Import EventCard

const RECENT_SEARCHES_STORAGE_KEY = 'recentSearches';
const MAX_RECENT_SEARCHES = 5;

const SearchResultsPage: React.FC = () => {
  const router = useRouter();
  const { q } = router.query;
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<SearchResults | null>(null); // Use SearchResults type
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

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

  useEffect(() => {
    const fetchSearchResults = async (query: string) => {
      setLoading(true);
      try {
        const data = await api.search(query);
        setResults(data);
        // Add query to recent searches if it's a new search
        if (query.trim() && !recentSearches.includes(query.trim())) {
          setRecentSearches(prevSearches => {
            const newSearches = [query.trim(), ...prevSearches.filter(s => s !== query.trim())];
            return newSearches.slice(0, MAX_RECENT_SEARCHES);
          });
        }
      } catch (error) {
        console.error('Failed to fetch search results:', error);
        setResults(null); // Or set an error state
      } finally {
        setLoading(false);
      }
    };

    if (q) {
      const query = Array.isArray(q) ? q[0] : q;
      setSearchQuery(query);
      fetchSearchResults(query);
    } else {
      setSearchQuery('');
      setResults(null);
      setLoading(false);
    }
  }, [q]); // Depend on the 'q' query parameter

  const handleRecentSearchClick = (query: string) => {
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  const hasResults = results && (results.events.length > 0 || results.categories.length > 0 || results.tags.length > 0);

  return (
    <>
      <Head>
        <title>{searchQuery ? `Search Results for "${searchQuery}"` : 'Search Results'} | ExtendMyTrip.com</title>
      </Head>
      <div className="container mx-auto p-4 mt-8">
        <h1 className="text-3xl font-bold mb-6">Search Results {searchQuery && `for "${searchQuery}"`}</h1>

        {loading ? (
          <p>Loading search results...</p>
        ) : searchQuery && !hasResults ? (
           <p>No results found for "{searchQuery}".</p>
        ) : results ? (
          <div>
            {/* Placeholder for filters */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-2">Filters (TODO)</h2>
              {/* Filter components will go here */}
            </div>

            {/* Events Results */}
            {results.events.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Matching Events</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.events.map((event: Event) => (
                    // Render EventCard always expanded on search results page
                    <EventCard key={event.id} event={event} isExpanded={true} onToggle={() => {}} />
                  ))}
                </div>
              </div>
            )}

            {/* Categories Results */}
            {results.categories.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Matching Categories</h2>
                <div className="flex flex-wrap gap-2">
                  {results.categories.map((category: Category) => (
                    <span key={category.id} className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
                      {category.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Tags Results */}
            {results.tags.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Matching Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {results.tags.map((tag: Tag) => (
                    <span key={tag.id} className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded">
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

          </div>
        ) : (
          // Display recent searches if no query is active
          recentSearches.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Recent Searches</h2>
              <ul>
                {recentSearches.map((search, index) => (
                  <li key={index} className="mb-2">
                    <button
                      onClick={() => handleRecentSearchClick(search)}
                      className="text-blue-600 hover:underline focus:outline-none"
                    >
                      {search}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )
        )}
         {/* Display recent searches if no results found for the query */}
         {searchQuery && !hasResults && recentSearches.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Recent Searches</h2>
              <ul>
                {recentSearches.map((search, index) => (
                  <li key={index} className="mb-2">
                    <button
                      onClick={() => handleRecentSearchClick(search)}
                      className="text-blue-600 hover:underline focus:outline-none"
                    >
                      {search}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
      </div>
    </>
  );
};

export default SearchResultsPage;
