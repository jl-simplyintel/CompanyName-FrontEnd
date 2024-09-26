import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Breadcrumbs_Product from '../../components/Breadcrumbs_Product';

export default function ProductDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);
  const [business, setBusiness] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newReview, setNewReview] = useState('');
  const [newRating, setNewRating] = useState(5);

  useEffect(() => {
    if (id) {
      fetchProduct(id);
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
        setError('Failed to fetch product details');
        setLoading(false);
        return;
      }

      const productData = result.data?.product;
      if (!productData) {
        throw new Error('Product not found');
      }

      setProduct(productData);
      setBusiness(productData.business || null);
      setReviews(productData.reviews || []);
      setLoading(false);
    } catch (error) {
      setError(error.message || 'An error occurred while fetching the product.');
      setLoading(false);
    }
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (totalRating / reviews.length).toFixed(1);
  };

  // Placeholder function to handle new review submission
  const submitReview = () => {
    console.log('Submitting review:', newRating, newReview);
    // Handle API call for submitting review
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <div className="container mx-auto mt-10 p-4">
      {/* Breadcrumbs */}
      <Breadcrumbs_Product
        businessId={business?.id}
        businessName={business?.name}
        productName={product?.name}
      />

      {/* Product Section */}
      {product && (
        <>
          <div className="flex justify-between">
            <div className="w-1/2">
              {/* Product Image or Carousel */}
              {product.images.length > 1 ? (
                <div className="carousel-container">
                  {/* Implement your own image carousel here */}
                  {/* Sample code: */}
                  {product.images.map((img, index) => (
                    <img
                      key={index}
                      src={`https://companynameadmin-008a72cce60a.herokuapp.com${img.file.url}`}
                      alt={product.name}
                      className="w-full h-96 object-cover rounded-lg shadow-lg mb-4"
                    />
                  ))}
                </div>
              ) : (
                <img
                  src={`https://companynameadmin-008a72cce60a.herokuapp.com${product.images[0]?.file?.url}`}
                  alt={product?.name}
                  className="w-full h-96 object-cover rounded-lg shadow-lg mb-4"
                />
              )}
            </div>

            <div className="w-1/2 pl-8">
              {/* Product Description */}
              <h3 className="text-xl font-bold mb-4">Product Description</h3>
              <p className="text-lg text-gray-700 mb-6">{product?.description}</p>

              {/* Product Rating */}
              <h3 className="text-xl font-bold mb-4">Average Rating: {calculateAverageRating()} / 5</h3>
              <div className="text-yellow-500 flex">
                {Array.from({ length: 5 }, (_, index) => (
                  <svg
                    key={index}
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-6 w-6 ${index < Math.floor(calculateAverageRating()) ? 'fill-current' : 'text-gray-300'}`}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="flex justify-between mt-10">
            {/* Product Reviews List */}
            <div className="w-1/2 pr-8">
              <h3 className="text-2xl font-semibold mb-4">Product Reviews</h3>
              <div className="h-96 overflow-y-scroll bg-gray-50 p-4 rounded-lg shadow-lg">
                {reviews.length > 0 ? (
                  <ul className="space-y-4">
                    {reviews.map((review) => (
                      <li key={review.id} className="bg-white p-4 rounded-lg shadow-sm border">
                        <div className="flex justify-between">
                          <div>
                            <h4 className="font-bold">{review.user.name}</h4>
                            <p className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                          </div>
                          <p className="text-yellow-500">Rating: {review.rating}/5</p>
                        </div>
                        <p className="mt-2">{review.content}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No reviews found for this product.</p>
                )}
              </div>
            </div>

            {/* Review Form */}
            <div className="w-1/2 bg-white p-6 rounded-lg shadow-lg">
              <h4 className="text-xl font-bold mb-2">Write a Review</h4>
              <div className="flex items-center mb-2">
                <span className="mr-2">Rating: </span>
                {Array.from({ length: 5 }, (_, i) => (
                  <svg
                    key={i}
                    onClick={() => setNewRating(i + 1)}
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-6 w-6 cursor-pointer ${i < newRating ? 'fill-current text-yellow-500' : 'text-gray-300'}`}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-lg mb-4"
                placeholder="Write your review here..."
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
              />
              <button
                className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
                onClick={submitReview}
              >
                Submit Review
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
