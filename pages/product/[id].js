import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css'; // Import Swiper core styles
import 'swiper/css/pagination'; // Import pagination styles
import 'swiper/css/navigation'; // Import navigation styles
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Breadcrumbs_Product from '../../components/Breadcrumbs_Product';
import SwiperCore, { Pagination, Navigation } from 'swiper';

// Install Swiper modules
SwiperCore.use([Pagination, Navigation]);

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

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <div className="container mx-auto mt-10 p-4">
      <Breadcrumbs_Product
        businessId={business?.id}
        businessName={business?.name}
        productName={product?.name}
      />

      {/* Product Section */}
      {product && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Swiper Carousel for Images */}
          <div>
            <Swiper
              pagination={{ clickable: true }}
              navigation={true}
              loop={true}
            >
              {product.images.map((image, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={`https://companynameadmin-008a72cce60a.herokuapp.com${image.file.url}`}
                    alt={`Product Image ${index + 1}`}
                    className="w-full h-auto object-cover rounded-lg"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Product Details */}
          <div>
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
            <p className="text-lg">{product.description}</p>

            <div className="mt-4">
              <p className="text-xl font-semibold">Average Rating: {calculateAverageRating()} / 5</p>
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
        </div>
      )}
    </div>
  );
}
