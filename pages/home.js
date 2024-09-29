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

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

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
            reviews { rating }
          }
        }
      `;

      const response = await fetch('https://companynameadmin-008a72cce60a.herokuapp.com/api/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      const result = await response.json();
      const sortedBusinesses = result.data.businesses.sort((a, b) => a.name.localeCompare(b.name));
      setBusinesses(sortedBusinesses);
      setSearchResults(sortedBusinesses);
    } catch (error) {
      console.error('Error fetching businesses:', error);
    }
  };

  const handleSearchResults = (results) => {
    setSearchResults(results);
    setShowDefault(results.length === 0);
    setCurrentPage(1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBusinesses = (showDefault ? businesses : searchResults).slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil((showDefault ? businesses.length : searchResults.length) / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <ErrorBoundary>
      <div className="bg-gray-100 min-h-screen">
        <Head>
          <title>Explore Businesses</title>
        </Head>
        <Search businesses={businesses} onSearchResults={handleSearchResults} />
        <main className={`container mx-auto mt-10 px-4 ${showDefault ? 'block' : 'hidden'}`}>
          <section>
            <h2 className="text-center text-3xl font-semibold mb-8">Explore Businesses</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {currentBusinesses.map((business) => (
                <Link key={business.id} href={`/business/${business.id}`}>
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
