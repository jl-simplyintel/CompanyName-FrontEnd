import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Link from 'next/link'; // For routing with 'Learn More' button
import Breadcrumbs_Products from '../../components/Breadcrumbs_Products';

export default function Products() {
  const router = useRouter();
  const { id } = router.query; // Use 'id' to match dynamic route [id].js
  const [products, setProducts] = useState([]);
  const [business, setBusiness] = useState(null); // State for business

  useEffect(() => {
    if (id) {
      fetchBusiness(id); // Fetch business details and products
    }
  }, [id]);

  const fetchBusiness = async (businessId) => {
    try {
      const query = `
      {
        business(where: { id : "${businessId}" }) {
          id
          name
          products {
            id
            name
            description
            images {
              file {
                url
              }
            }
          }
        }
      }
      `;

      const response = await fetch('https://companynameadmin-008a72cce60a.herokuapp.com/api/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      const result = await response.json();
      console.log('Business API Result:', result); // Log the result

      if (result.errors) {
        console.error('GraphQL Errors:', result.errors);
      }

      setBusiness(result.data?.business || null);
      setProducts(result.data?.business?.products || []); // Set products from the business data
    } catch (error) {
      console.error('Error fetching business:', error);
    }
  };

  return (
    <div className="container mx-auto mt-10 p-4">
      {/* Show breadcrumbs and business name even if no products */}
      <Breadcrumbs_Products businessName={business?.name || ''} />

      {/* Only render the business name if it's available */}
      {business && (
        <>
          <h1 className="text-3xl font-bold mb-6">{business?.name}</h1>
          <h3 className="text-3xl font-bold mb-6">Products</h3>
        </>
      )}

      {/* If no products, display a message */}
      {products.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white p-6 shadow-lg rounded-lg hover:shadow-2xl transition-shadow duration-300">
              <div className="mb-4">
                {product.images && product.images[0]?.file?.url ? (
                  <img 
                    src={`https://companynameadmin-008a72cce60a.herokuapp.com${product.images[0].file.url}`} 
                    alt={product.name} 
                    className="w-full h-48 object-cover rounded-lg" 
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 rounded-lg" />
                )}
              </div>
              <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
              {/* Learn More Button */}
              <Link href={`/products/${product.id}`}>
                <a className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-300">Learn More</a>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
