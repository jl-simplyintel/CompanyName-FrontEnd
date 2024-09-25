import { useState } from 'react';

export default function Sitemap({ businesses, staticPages }) {
  // Pagination states for business links
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;
  const maxPages = 10; // Limit to 10 pages

  // Calculate total number of pages for businesses, limiting to maxPages
  const totalPages = Math.min(Math.ceil(businesses.length / itemsPerPage), maxPages);

  // Get current businesses to display on the page
  const currentBusinesses = businesses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold my-8">Sitemap</h1>

      {/* Other Links Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Other Links</h2>
        <ul className="list-disc list-inside">
          {staticPages.map((path, index) => (
            <li key={`static-${index}`}>
              <a href={path.url} className="text-blue-500 hover:underline">
                {path.name}
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* Business Links Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Business Links</h2>
        <ul className="list-disc list-inside grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {currentBusinesses.map((business) => (
            <li key={`business-${business.id}`}>
              <a href={`/business/${business.id}`} className="text-blue-500 hover:underline">
                {business.name}
              </a>
              {/* Nested list for quotes, reviews, and complaints */}
              <ul className="list-inside ml-4 mt-2">
                <li>
                  <a href={`/quote/${business.id}`} className="text-blue-400 hover:underline">
                    Quotes
                  </a>
                </li>
                <li>
                  <a href={`/review/${business.id}`} className="text-blue-400 hover:underline">
                    Reviews
                  </a>
                </li>
                <li>
                  <a href={`/complaint/${business.id}`} className="text-blue-400 hover:underline">
                    Complaints
                  </a>
                </li>
              </ul>
            </li>
          ))}
        </ul>

        {/* Pagination Controls */}
        <div className="mt-8 flex justify-center space-x-2">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={`page-${index + 1}`}
              onClick={() => handlePageChange(index + 1)}
              className={`px-4 py-2 border rounded ${
                currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

export async function getServerSideProps() {
  // Fetch all dynamic paths (e.g., businesses) from your Keystone API
  const query = `
    {
      businesses {
        id
        name
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

  // Extract businesses and sort them alphabetically by name
  const businesses = result.data.businesses
    .map((business) => ({
      id: business.id,
      name: business.name,
    }))
    .sort((a, b) => a.name.localeCompare(b.name)); // Sorting alphabetically

  // Define static pages
  const staticPages = [
    { url: '/', name: 'Home' },
    { url: '/about', name: 'About' },
    { url: '/contact', name: 'Contact' },
    { url: '/services', name: 'Services' },
  ];

  return {
    props: {
      businesses,
      staticPages,
    },
  };
}
