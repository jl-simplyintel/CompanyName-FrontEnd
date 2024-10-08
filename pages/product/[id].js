import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Breadcrumbs_Product from '../../components/Breadcrumbs_Product';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation, Pagination } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Head from 'next/head'; // Import Head for SEO

SwiperCore.use([Navigation, Pagination]);

export default function ProductDetails() {
  const router = useRouter();
  const { id } = router.query;
  const { data: session } = useSession();
  const [product, setProduct] = useState(null);
  const [business, setBusiness] = useState(null);
  const [reviews, setReviews] = useState([]);
  // const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newReview, setNewReview] = useState('');
  const [newRating, setNewRating] = useState(5);
  // const [newComplaint, setNewComplaint] = useState('');
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProduct(id, session?.user?.id);
    }
  }, [id, session]);

  const fetchProduct = async (productId, userId) => {
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
          complaints(where: { user: { id: { equals: "${userId}" } } }) {
            id
            content
            status
            createdAt
            user {
              id
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
      // setComplaints(productData.complaints || []);
      setLoading(false);
    } catch (error) {
      setError(error.message || 'An error occurred while fetching the product.');
      setLoading(false);
    }
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + Number(review.rating), 0);
    return (totalRating / reviews.length).toFixed(1);
  };

  const handleSubmitReview = async () => {
    if (!session) {
      alert('You need to be signed in to submit a review.');
      return;
    }

    try {
      const mutation = `
        mutation CreateProductReview($data: ProductReviewCreateInput!) {
          createProductReview(data: $data) {
            id
          }
        }
      `;

      const variables = {
        data: {
          user: {
            connect: {
              id: session.user.id,
            },
          },
          product: {
            connect: {
              id: id,
            },
          },
          rating: newRating.toString(),
          content: newReview,
          moderationStatus: "2",
        },
      };

      const response = await fetch('https://companynameadmin-008a72cce60a.herokuapp.com/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: mutation, variables }),
      });

      const result = await response.json();
      if (result.errors) {
        console.error('GraphQL errors:', result.errors);
      } else {
        alert('Review submitted successfully!');
        setNewReview('');
        setNewRating(5);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  // const handleSubmitComplaint = async () => {
  //   if (!session) {
  //     alert('You need to be signed in to submit a complaint.');
  //     return;
  //   }

  //   try {
  //     const mutation = `
  //       mutation CreateComplaint($data: ComplaintCreateInput!) {
  //         createComplaint(data: $data) {
  //           id
  //         }
  //       }
  //     `;

  //     const variables = {
  //       data: {
  //         user: {
  //           connect: {
  //             id: session.user.id,
  //           },
  //         },
  //         product: {
  //           connect: {
  //             id: id,
  //           },
  //         },
  //         content: newComplaint,
  //         status: "Pending",
  //       },
  //     };

  //     const response = await fetch('https://companynameadmin-008a72cce60a.herokuapp.com/api/graphql', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ query: mutation, variables }),
  //     });

  //     const result = await response.json();
  //     if (result.errors) {
  //       console.error('GraphQL errors:', result.errors);
  //     } else {
  //       alert('Complaint submitted successfully!');
  //       setNewComplaint('');
  //     }
  //   } catch (error) {
  //     console.error('Error submitting complaint:', error);
  //   }
  // };

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  // const getComplaintStatus = (status) => {
  //   if (status === '0') return 'Resolved';
  //   if (status === '1') return 'Pending';
  //   return 'Unknown Status';
  // };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  const metaKeywords = product ? `${product.name}, ${business?.name}, reviews, complaints, products` : 'products, business, reviews';
  const metaDescription = product ? `${product.name} from ${business?.name}. Learn more about its features, reviews, and file complaints.` : 'Product details.';

  return (
    <div className="container mx-auto mt-10 p-4">
      {/* SEO Head */}
      <Head>
        <title>{product ? `${product.name} - ${business?.name}` : 'Product Details'}</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={metaKeywords} />
        <meta name="robots" content="index, follow" />
      </Head>

      {/* Breadcrumbs */}
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
              className="rounded-lg shadow-lg"
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

          {/* Product Information */}
          <div>
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
            <div className="text-lg mb-4">
              {showFullDescription ? (
                <>
                  <p>{product.description}</p>
                  <button
                    onClick={toggleDescription}
                    className="text-blue-500 ml-2 underline"
                  >
                    See Less
                  </button>
                </>
              ) : (
                <>
                  <p>{product.description.slice(0, 100)}...</p>
                  <button
                    onClick={toggleDescription}
                    className="text-blue-500 ml-2 underline"
                  >
                    See More
                  </button>
                </>
              )}
            </div>


            <p className="text-xl font-semibold mb-4">
              Average Rating: {calculateAverageRating()} / 5
            </p>
            <div className="text-yellow-500 flex mb-6">
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
      )}

      {/* Reviews Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-10">
        {/* Reviews List */}
        <div>
          <h3 className="text-2xl font-bold mb-4">Product Reviews</h3>
          <div className="max-h-64 overflow-y-auto scrollbar-thumb">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white p-4 rounded-lg shadow-md mb-4"
                >
                  <h4 className="font-bold">{review.user.name}</h4>
                  <p className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-yellow-500">Rating: {review.rating} / 5</p>
                  <p className="mt-2">{review.content}</p>
                </div>
              ))
            ) : (
              <p>No reviews available for this product.</p>
            )}
          </div>
        </div>

        {/* Add Review Form */}
        <div>
          <h3 className="text-2xl font-bold mb-4">Write a Review</h3>
          {!session ? (
            <p>You need to be signed in to submit a review.</p>
          ) : (
            <>
              <select
                className="w-full mb-2 border border-gray-300 p-2 rounded-lg"
                value={newRating}
                onChange={(e) => setNewRating(parseInt(e.target.value))}
              >
                {Array.from({ length: 5 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1} Star{(i + 1) > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-lg mb-4"
                placeholder="Write your review here..."
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
              />
              <button
                className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
                onClick={handleSubmitReview}
              >
                Submit Review
              </button>
            </>
          )}
        </div>
      </div>

      {/* Complaints Section */}
      {/* <div className="mt-10">
        <h3 className="text-2xl font-bold mb-4">Your Complaints</h3>
        <div className="max-h-64 overflow-y-auto scrollbar-thumb mb-6">
          {complaints.length > 0 ? (
            complaints.map((complaint) => (
              <div
                key={complaint.id}
                className="bg-white p-4 rounded-lg shadow-md mb-4"
              >
                <p className="text-sm text-gray-500">
                  {new Date(complaint.createdAt).toLocaleDateString()}
                </p>
                <p className="mt-2">{complaint.content}</p>
                <p className="mt-2 text-gray-500">Status: {getComplaintStatus(complaint.status)}</p>
              </div>
            ))
          ) : (
            <p>No complaints filed for this product.</p>
          )}
        </div> */}

        {/* Add Complaint Form */}
        {/* <div>
          <h3 className="text-2xl font-bold mb-4">File a Complaint</h3>
          {!session ? (
            <p>You need to be signed in to file a complaint.</p>
          ) : (
            <>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-lg mb-4"
                placeholder="Write your complaint here..."
                value={newComplaint}
                onChange={(e) => setNewComplaint(e.target.value)}
              />
              <button
                className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-700 transition duration-300"
                onClick={handleSubmitComplaint}
              >
                Submit Complaint
              </button>
            </>
          )}
        </div>
      </div> */}
    </div>
  );
}
