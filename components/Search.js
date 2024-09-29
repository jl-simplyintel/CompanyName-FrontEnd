import { useState, useEffect } from 'react';

const Search = ({ businesses, onSearchResults }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showClearIcon, setShowClearIcon] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isMinimized, setIsMinimized] = useState(false); // State to control minimization

  // Non-debounced search for debugging
  const performSearch = (query) => {
    console.log('Search Query:', query); // Check if query is being passed
    console.log('Businesses:', businesses); // Check if businesses array is accessible

    const filteredResults = businesses.filter((business) => {
      const nameMatch = business.name.toLowerCase().includes(query.toLowerCase());
      const locationMatch = business.location && business.location.toLowerCase().includes(query.toLowerCase());
      const emailMatch = business.contactEmail && business.contactEmail.toLowerCase().includes(query.toLowerCase());
      return nameMatch || locationMatch || emailMatch;
    });

    console.log('Filtered Results:', filteredResults); // Log filtered results
    setSuggestions(query ? filteredResults : []);
    onSearchResults(filteredResults);
  };

  // Handle input change
  const handleInputChange = (e) => {
    const query = e.target.value;
    console.log('User typing:', query); // Add this log to check if input change is detected
    setSearchQuery(query);
    setShowClearIcon(query.length > 0);
    performSearch(query); // Temporarily using performSearch instead of debounce for debugging
  };

  // Clear search functionality
  const handleClearSearch = () => {
    setSearchQuery('');
    setShowClearIcon(false);
    setSuggestions([]);
    onSearchResults(businesses); // Reset to default businesses
    console.log("Search Query Cleared");
    console.log("Suggestions Cleared");
  };

  // Minimize/Expand toggle
  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  // Highlight the matched part in search results
  const highlightMatch = (text, query) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? <span key={index} className="text-blue-600 font-semibold">{part}</span> : part
    );
  };

  return (
    <section className="relative flex items-center justify-center bg-cover bg-center bg-no-repeat h-[20rem] z-50" style={{ backgroundImage: "url('/images/background-image.jpg')" }}>
      <div className="w-full max-w-2xl p-8 rounded-xl shadow-lg text-center backdrop-blur-md bg-white/30 border border-white/20 relative z-50" style={{ boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)' }}>
        <h1 className="text-4xl font-bold text-blue-600 mb-4">Find Your Perfect Business</h1>
        <p className="text-lg text-gray-700 mb-6">Search for businesses, services, technologies, and more.</p>

        <div className="relative">
          <i className="bi bi-search absolute left-4 top-1/2 transform -translate-y-1/2 text-black"></i>
          <input
            type="text"
            id="search"
            className="w-full py-3 pl-10 pr-4 rounded-full shadow focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/60 backdrop-blur-md border border-gray-300"
            value={searchQuery}
            onChange={handleInputChange} // Input change handler
            placeholder="Search for businesses, keywords, technologies..."
          />
          {showClearIcon && (
            <i className="bi bi-x absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer" onClick={handleClearSearch}></i>
          )}

          {/* Suggestions List */}
          {suggestions.length > 0 && !isMinimized && (
            <div className="absolute left-0 mt-2 w-full bg-white shadow-lg rounded-lg z-50 max-h-64 overflow-y-auto">
              <div className="flex justify-end p-2">
                <button
                  className="text-sm text-gray-600 hover:text-gray-900 cursor-pointer"
                  onClick={toggleMinimize}
                >
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

          {/* Minimized state */}
          {isMinimized && (
            <div className="absolute left-0 mt-2 w-full bg-white shadow-lg rounded-lg z-50">
              <div className="flex justify-end p-2">
                <button
                  className="text-sm text-gray-600 hover:text-gray-900 cursor-pointer"
                  onClick={toggleMinimize}
                >
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
