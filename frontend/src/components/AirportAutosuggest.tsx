import React, { useState, useEffect, useRef } from 'react';

interface AirportAutosuggestProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

// Mock airport data
const mockAirports = [
  { code: 'BER', name: 'Berlin Brandenburg Airport', city: 'Berlin', country: 'Germany' },
  { code: 'LHR', name: 'Heathrow Airport', city: 'London', country: 'United Kingdom' },
  { code: 'CDG', name: 'Charles de Gaulle Airport', city: 'Paris', country: 'France' },
  { code: 'JFK', name: 'John F. Kennedy International Airport', city: 'New York', country: 'United States' },
  { code: 'LAX', name: 'Los Angeles International Airport', city: 'Los Angeles', country: 'United States' },
  { code: 'HND', name: 'Tokyo Haneda Airport', city: 'Tokyo', country: 'Japan' },
  { code: 'PEK', name: 'Beijing Capital International Airport', city: 'Beijing', country: 'China' },
];

const AirportAutosuggest: React.FC<AirportAutosuggestProps> = ({
  value,
  onChange,
  placeholder,
  className,
}) => {
  const [suggestions, setSuggestions] = useState<typeof mockAirports>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (value.length > 1) { // Start suggesting after 2 characters
      const filteredSuggestions = mockAirports.filter(airport =>
        airport.name.toLowerCase().includes(value.toLowerCase()) ||
        airport.city.toLowerCase().includes(value.toLowerCase()) ||
        airport.code.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [value]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current && !inputRef.current.contains(event.target as Node) &&
        suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleSuggestionClick = (airport: typeof mockAirports[0]) => {
    onChange(`${airport.city}, ${airport.country} (${airport.code})`); // Format the selected value
    setShowSuggestions(false);
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        onFocus={() => value.length > 1 && setSuggestions(mockAirports.filter(airport =>
            airport.name.toLowerCase().includes(value.toLowerCase()) ||
            airport.city.toLowerCase().includes(value.toLowerCase()) ||
            airport.code.toLowerCase().includes(value.toLowerCase())
          ))} // Show suggestions on focus if input has value
        placeholder={placeholder}
        className={className}
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul
          ref={suggestionsRef}
          className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-60 overflow-auto"
        >
          {suggestions.map(airport => (
            <li
              key={airport.code}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm"
              onClick={() => handleSuggestionClick(airport)}
            >
              {airport.city}, {airport.country} ({airport.code}) - {airport.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AirportAutosuggest;
