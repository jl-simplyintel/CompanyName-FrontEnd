import { useState, useEffect } from 'react';
import debounce from 'lodash/debounce';

const Search = ({ businesses, onSearchResults }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showClearIcon, setShowClearIcon] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isMinimized, setIsMinimized] = useState(false);

  const debouncedSearch = debounce((query) => {
    const filteredResults = businesses.filter((business) => {
      const nameMatch = business.name.toLowerCase().includes(query.toLowerCase());
      const locationMatch = business.location && business.location.toLowerCase().includes(query.toLowerCase());
      const emailMatch = business.contactEmail && business.contactEmail.toLowerCase().includes(query.toLowerCase());
      return nameMatch || locationMatch || emailMatch;
    });
    
    setSuggestions(query ? filteredResults : []);
    onSearchResults(filteredResults);
  }, 300);

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setShowClearIcon(query.length > 0);
    debouncedSearch(query);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setShowClearIcon(false);
    setSuggestions([]);
    onSearchResults(businesses);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const highlightMatch = (text, query) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? <span key={index} className="text-blue-600 font-semibold">{part}</span> : part
    );
  };

  return (
    <section className="relative flex items-center justify-center">
      <div className="w-full max-w-2xl p-8 text-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">Find Your Perfect Business</h1>
        <div className="relative">
          <input
            type="text"
            id="search"
            className="w-full py-3 pl-10 pr-4 rounded-full"
            value={searchQuery}
            onChange={handleInputChange}
            placeholder="Search for businesses..."
          />
          {showClearIcon && (
            <i className="bi bi-x absolute right-4 cursor-pointer" onClick={handleClearSearch}></i>
          )}
          {suggestions.length > 0 && !isMinimized && (
            <div className="absolute left-0 mt-2 w-full bg-white shadow-lg rounded-lg max-h-64 overflow-y-auto">
              <div className="flex justify-end p-2">
                <button onClick={toggleMinimize}>
                  <i className="bi bi-chevron-up"></i>
                </button>
              </div>
              {suggestions.map((business, index) => (
                <div key={index} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  <p>{highlightMatch(business.name, searchQuery)}</p>
                  <p className="text-sm text-gray-500">{business.location}</p>
                </div>
              ))}
            </div>
          )}
          {isMinimized && (
            <div className="absolute left-0 mt-2 w-full bg-white shadow-lg rounded-lg">
              <div className="flex justify-end p-2">
                <button onClick={toggleMinimize}>
                  <i className="bi bi-chevron-down"></i>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Search;
