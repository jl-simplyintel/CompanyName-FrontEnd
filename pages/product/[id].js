import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Breadcrumbs_Product from '../../components/Breadcrumbs_Product';

export default function ProductDetails() {
  const router = useRouter();
  const { id } = router.query; // Access the dynamic product ID
  const [product, setProduct] = useState(null);
  const [business, setBusiness] = useState(null); // To hold business info
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchProduct(id); // Fetch product details by ID
    }
  }, [id]);

  const fetchProduct = async (productId) => {
    try {
      const query = `
      {
        product(where: { id: "${productId}" }) {
          id
          name
          description
          images {
            file {
              url
            }
          }
          business {
            id
            name
          }
          reviews {
            id
            rating
            content
            createdAt
            user {
              name
            }
          }
          complaints {
            id
            subject
            content
            status
            createdAt
            user {
              name
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
      console.log('API Response:', result); // Log the result to inspect it

      if (result.errors) {
        console.error('GraphQL Errors:', result.errors); // Log errors
        setError('Failed to fetch product details');
        setLoading(false);
        return;
      }

      const productData = result.data?.product;
      if (!productData) {
        throw new Error('Product not found');
      }

      setProduct(productData);
      setBusiness(productData.business || null); // Set the business info
      setLoading(false);
    } catch (error) {
      console.error('Error fetching product:', error);
      setError(error.message || 'An error occurred while fetching the product.');
      setLoading(false);
    }
  };

  // Show loading state
  if (loading) return <p className="text-center mt-10">Loading...</p>;

  // Show error message if there is one
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  // Only render if the product data is available
  return (
    <div className="container mx-auto mt-10 p-4">
      {/* Breadcrumbs */}
      <Breadcrumbs_Product
        businessId={business?.id}  // Pass the businessId
        businessName={business?.name}
        productName={product?.name}
      />

      {/* Product Details */}
      {product && (
        <>
          <h1 className="text-3xl font-bold mb-6">{product?.name}</h1>
          <div className="mb-4">
            {product.images && product.images[0]?.file?.url ? (
              <img
                src={`https://companynameadmin-008a72cce60a.herokuapp.com${product.images[0].file.url}`}
                alt={product?.name}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
            ) : (
              <div className="w-full h-64 bg-gray-200 rounded-lg mb-4" />
            )}
          </div>
          <p className="text-lg text-gray-700 mb-4">{product?.description}</p>

          {business && (
            <div className="mb-4">
              <h2 className="text-xl font-semibold">Business: {business.name}</h2>
            </div>
          )}

          {/* Reviews Section */}
          <div className="mt-8">
            <h3 className="text-2xl font-semibold mb-4">Product Reviews</h3>
            {product.reviews && product.reviews.length > 0 ? (
              <ul className="space-y-4">
                {product.reviews.map((review) => (
                  <li key={review.id} className="bg-gray-100 p-4 rounded-lg shadow-md">
                    <h4 className="font-bold">{review.user.name}</h4>
                    <p className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                    <p className="mt-2">Rating: {review.rating}/5</p>
                    <p className="mt-2">{review.content}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No reviews found for this product.</p>
            )}
          </div>

          {/* Complaints Section */}
          <div className="mt-8">
            <h3 className="text-2xl font-semibold mb-4">Product Complaints</h3>
            {product.complaints && product.complaints.length > 0 ? (
              <ul className="space-y-4">
                {product.complaints.map((complaint) => (
                  <li key={complaint.id} className="bg-red-100 p-4 rounded-lg shadow-md">
                    <h4 className="font-bold">{complaint.user.name} - {complaint.subject}</h4>
                    <p className="text-sm text-gray-500">{new Date(complaint.createdAt).toLocaleDateString()}</p>
                    <p className="mt-2">{complaint.content}</p>
                    <p className={`mt-2 font-bold ${complaint.status === '1' ? 'text-yellow-500' : 'text-green-500'}`}>
                      Status: {complaint.status === '1' ? 'Pending' : 'Closed'}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No complaints found for this product.</p>
            )}
          </div>

          {/* Go Back Button */}
          <button
            onClick={() => router.back()}
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-300 mt-6"
          >
            Go Back
          </button>
        </>
      )}
    </div>
  );
}
