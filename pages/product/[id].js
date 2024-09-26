import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Breadcrumbs_Product from '../../components/Breadcrumbs_Product';

export default function ProductDetails() {
  const router = useRouter();
  const { id: productId, businessId } = router.query; // Access both productId and businessId
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (productId && businessId) {
      fetchProduct(businessId, productId);
    }
  }, [productId, businessId]);

  const fetchProduct = async (businessId, productId) => {
    try {
      const query = `
      {
        business(where: { id : "${businessId}" }) {
          id
          name
          products(where: { id: "${productId}" }) {
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

      if (result.errors) {
        console.error('GraphQL Errors:', result.errors); // Log errors
        setError('Failed to fetch product details');
        setLoading(false);
        return;
      }

      const business = result.data?.business;
      const product = business?.products?.[0]; // Assuming each product ID is unique to the business

      if (product) {
        setProduct(product);
      } else {
        setError('No product found');
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching product:', error);
      setError('An error occurred while fetching the product.');
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <div className="container mx-auto mt-10 p-4">
      {/* Breadcrumbs */}
      <Breadcrumbs_Product businessId={businessId} productName={product?.name} />

      {/* Product Details */}
      {product && (
        <>
          <h1 className="text-3xl font-bold mb-6">{product.name}</h1>
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

          {/* Go Back Button */}
          <button
            onClick={() => router.back()}
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
          >
            Go Back
          </button>
        </>
      )}
    </div>
  );
}
