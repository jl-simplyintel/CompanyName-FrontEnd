import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiMail, FiPhone, FiMapPin, FiGlobe } from 'react-icons/fi';

const Businesses = () => {
  const [businesses, setBusinesses] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const router = useRouter(); // Initialize useRouter

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
            contactEmail
            contactPhone
            location
            website
            description
            reviews {
              rating
            }
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
      setBusinesses(result.data.businesses);
    } catch (error) {
      console.error('Error fetching businesses:', error);
    }
  };

  const renderStars = (averageRating) => {
    return Array.from({ length: 5 }, (_, index) => {
      const starFill = averageRating - index;
      if (starFill >= 1) {
        return <i key={index} className="bi bi-star-fill text-yellow-500"></i>; // Full star
      } else if (starFill >= 0.5) {
        return <i key={index} className="bi bi-star-half text-yellow-500"></i>; // Half star
      } else {
        return <i key={index} className="bi bi-star text-yellow-500"></i>; // Empty star
      }
    });
  };

  // Filter businesses based on the search query
  const filteredBusinesses = businesses.filter((business) =>
    business.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-4 text-center text-blue-600">All Businesses</h1>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search businesses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
      </div>

      <div className="space-y-4"> {/* Stack items vertically */}
        {filteredBusinesses.map((business) => {
          const totalReviews = business.reviews.length;
          const averageRating = totalReviews > 0
            ? (business.reviews.reduce((sum, review) => sum + Number(review.rating), 0) / totalReviews).toFixed(1)
            : 0;

          return (
            <div key={business.id} className="flex flex-col md:flex-row items-stretch justify-between p-6 bg-white rounded-lg shadow-lg border border-gray-200 hover:shadow-2xl transition duration-300">
              {/* First Column: Business Name and Contact Info */}
              <Link href={`/business/${business.id}`} className="md:w-1/3 md:pr-6 md:border-r border-gray-300 flex-1 hover:cursor-pointer" target='_blank'>
                <div>
                  <h2 className="text-2xl font-bold text-blue-600 mb-2">{business.name}</h2>
                  <p className="text-gray-600 mb-1"><FiMail className="inline mr-2" />
                    <Link href={`mailto:${business.contactEmail}`} className="text-blue-500 hover:underline">Email Us Here</Link>
                  </p>
                  <p className="text-gray-600 mb-1"><FiPhone className="inline mr-2" /> {business.contactPhone}</p>
                  <p className="text-gray-600 mb-1"><FiMapPin className="inline mr-2" /> {business.location}</p>
                  {business.website && (
                    <p className="text-blue-500">
                      <FiGlobe className="inline mr-2" />
                      <a href={business.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        Visit Website
                      </a>
                    </p>
                  )}
                </div>
              </Link>

              {/* Second Column: Description */}
              <div className="md:w-1/3 md:px-6 md:border-r border-gray-300 flex-1 mt-4 md:mt-0">
                <div className="text-gray-700">
                  {/* Render description or 'No description available' */}
                  {business.description ? business.description.substring(0, 150) : 'No description available'}
                </div>
              </div>

              {/* Third Column: Rating */}
              <div className="md:w-1/3 flex flex-col items-center pl-6 flex-1 justify-center mt-4 md:mt-0">
                <div className="flex items-center mb-2">
                  {renderStars(averageRating)}
                  <span className="ml-2 text-2xl font-bold text-blue-600">{averageRating}/5</span>
                </div>
                {totalReviews > 0 ? (
                  <Link href={`/review/${business.id}`} className="text-gray-600">
                    <i className="bi bi-chat-left-dots mr-1 text-blue-600"></i>
                    ({totalReviews} Review{totalReviews !== 1 ? 's' : ''})
                  </Link>
                ) : (
                  <button
                    className="mt-2 bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition duration-300"
                    onClick={(e) => {
                      e.preventDefault(); // Prevents link navigation
                      router.push(`/review/${business.id}`); // Navigate to review page
                    }}
                  >
                    Rate this Business
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Businesses;
