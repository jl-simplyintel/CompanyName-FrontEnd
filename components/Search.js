import { useState, useEffect } from 'react';
import debounce from 'lodash/debounce';
import styles from '../components/Search.module.css'; // Importing the module

const Search = ({ businesses, onSearchResults }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showClearIcon, setShowClearIcon] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isMinimized, setIsMinimized] = useState(false); // State to control minimization

  const debouncedSearch = debounce((query) => {
    const filteredResults = businesses.filter((business) =>
      business.name.toLowerCase().includes(query.toLowerCase()) ||
      (business.location && business.location.toLowerCase().includes(query.toLowerCase())) ||
      (business.contactEmail && business.contactEmail.toLowerCase().includes(query.toLowerCase()))
    );

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
    <section className={styles.searchContainer}>
      <div className={styles.searchContent}>
        <h1 className={styles.searchTitle}>Find Your Perfect Business</h1>
        <p className={styles.searchDescription}>Search for businesses, services, technologies, and more.</p>

        <div className={styles.searchBar}>
          <i className={`bi bi-search ${styles.searchIcon}`}></i>
          <input
            type="text"
            id="search"
            className={styles.searchInput}
            value={searchQuery}
            onChange={handleInputChange}
            placeholder="Search for businesses, keywords, technologies..."
          />
          {showClearIcon && (
            <i className={`bi bi-x ${styles.clearSearch}`} onClick={handleClearSearch}></i>
          )}

          {/* Suggestions List */}
          {suggestions.length > 0 && !isMinimized && (
            <div className={styles.suggestions}>
              <div className="flex justify-end p-2">
                <button className="text-sm text-gray-600 hover:text-gray-900 cursor-pointer" onClick={toggleMinimize}>
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
            <div className={styles.suggestions}>
              <div className="flex justify-end p-2">
                <button className="text-sm text-gray-600 hover:text-gray-900 cursor-pointer" onClick={toggleMinimize}>
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
