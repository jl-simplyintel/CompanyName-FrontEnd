import { useState, useEffect } from 'react';
import Head from 'next/head';
import Search from '../components/Search';
import Link from 'next/link';
import Card from '../components/Card';
import ErrorBoundary from '../components/ErrorBoundary';

export default function Home() {
  const [businesses, setBusinesses] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [showDefault, setShowDefault] = useState(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // Number of items per page

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      const query = `
        {
          businesses {
            id
            name
            description
            contactEmail
            contactPhone
            location
            keywords
            technologiesUsed
            reviews {
            rating}
          }
        }
      `;

      const response = await fetch('https://companynameadmin-008a72cce60a.herokuapp.com/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      const result = await response.json();
      console.log("Fetched businesses:", result.data.businesses);
      // Sort businesses alphabetically by name
      const sortedBusinesses = result.data.businesses.sort((a, b) =>
        a.name.localeCompare(b.name)
      );

      setBusinesses(sortedBusinesses);
      setSearchResults(sortedBusinesses); // Initialize search results with sorted businesses
    } catch (error) {
      console.error('Error fetching businesses:', error);
    }
  };

  // Handle search results
  const handleSearchResults = (results) => {
    // Sort search results alphabetically by name
    const sortedResults = results.sort((a, b) => a.name.localeCompare(b.name));
    setSearchResults(sortedResults);
    setShowDefault(sortedResults.length === 0);
    setCurrentPage(1); // Reset to first page on new search
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBusinesses = (showDefault ? businesses : searchResults).slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil((showDefault ? businesses.length : searchResults.length) / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <ErrorBoundary>
      <div className="bg-gray-100 min-h-screen">
        <Head>
          <title>Explore Businesses - Find the Perfect Business for Your Needs</title>
          <meta name="description" content="Search and explore a variety of businesses, services, technologies, and more. Find contact information, locations, and other details." />
          <meta name="keywords" content="business directory, search businesses, find businesses, business services" />
          <meta property="og:title" content="Explore Businesses - Find the Perfect Business for Your Needs" />
          <meta property="og:description" content="Search and explore a variety of businesses, services, technologies, and more." />
          <meta property="og:image" content="/images/og-image.jpg" />
          <meta property="og:url" content="https://yourwebsite.com" />
          <link rel="canonical" href="https://yourwebsite.com/home" />
        </Head>
        <Search businesses={businesses} onSearchResults={handleSearchResults} />

        {/* Main content */}
        <main id="default-content" className={`container mx-auto mt-10 px-4 ${showDefault ? 'block' : 'hidden'}`}>
          <section>
            <h2 className="text-center text-3xl font-semibold mb-8">Explore Businesses</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {currentBusinesses.map((business) => (
                <Link key={business.id} href={`/business/${business.id}`} target='_blank'>
                  <Card business={business} />
                </Link>
              ))}
            </div>
            <Pagination totalPages={totalPages} currentPage={currentPage} paginate={paginate} />
          </section>
        </main>

        {/* Search results */}
        <main id="search-results" className={`container mx-auto mt-10 px-4 ${showDefault ? 'hidden' : 'block'}`}>
          <section>
            <h2 className="text-center text-3xl font-semibold mb-8">Search Results</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {currentBusinesses.map((business) => (
                <Link className="custom-link" key={business.id} href={`/business/${business.id}`}>
                  <Card business={business} />
                </Link>
              ))}
            </div>
            <Pagination totalPages={totalPages} currentPage={currentPage} paginate={paginate} />
          </section>
        </main>
      </div>
    </ErrorBoundary>
  );
}

// Pagination component
const Pagination = ({ totalPages, currentPage, paginate }) => {
  const pageNumbers = [];

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (

    <div className="flex justify-center mt-6">
      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => paginate(number)}
          className={`mx-1 px-3 py-1 rounded ${number === currentPage ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'}`}
        >
          {number}
        </button>
      ))}
    </div>
  );
};
