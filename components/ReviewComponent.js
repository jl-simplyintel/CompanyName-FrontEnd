import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function ReviewComponent({ businessId }) {
    const router = useRouter();
    const { data: session } = useSession();
    const [business, setBusiness] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(0);
    const [reviewContent, setReviewContent] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);

    useEffect(() => {
        if (businessId) {
            fetchBusinessDetails(businessId);
            fetchBusinessReviews(businessId);
        }
    }, [businessId]);

    const fetchBusinessDetails = async (id) => {
        try {
            const query = `
            {
              business(where: { id: "${id}" }) {
                name
              }
            }`;

            const response = await fetch('https://companynameadmin-008a72cce60a.herokuapp.com/api/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query }),
            });

            const result = await response.json();
            setBusiness(result.data.business);
        } catch (error) {
            console.error('Error fetching business details:', error);
        }
    };

    const fetchBusinessReviews = async (id) => {
        try {
            const query = `
            {
              business(where: { id: "${id}" }) {
                reviews(where: { moderationStatus: { equals: "0" } }) {
                  id
                  rating
                  content
                  isAnonymous
                  user {
                    name
                  }
                  createdAt
                  replies {
                    content
                    createdAt
                  }
                }
              }
            }`;

            const response = await fetch('https://companynameadmin-008a72cce60a.herokuapp.com/api/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query }),
            });

            const result = await response.json();
            setReviews(result.data.business.reviews);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();

        if (!session) {
            router.push('/auth/signin');
            return;
        }

        try {
            const mutation = `
                mutation CreateReview($rating: String!, $content: String!, $businessId: ID!, $userId: ID!, $isAnonymous: String!, $moderationStatus: String!) {
                    createReview(data: {
                        rating: $rating,
                        content: $content,
                        business: { connect: { id: $businessId } },
                        user: { connect: { id: $userId } },
                        isAnonymous: $isAnonymous,
                        moderationStatus: $moderationStatus
                    }) {
                        id
                    }
                }
            `;

            const variables = {
                rating: rating.toString(),
                content: reviewContent,
                businessId: businessId,
                userId: session.user.id,
                isAnonymous: isAnonymous.toString(),
                moderationStatus: '2', // Set to 'Pending Approval'
            };

            const response = await fetch('https://companynameadmin-008a72cce60a.herokuapp.com/api/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: mutation, variables }),
            });

            const result = await response.json();

            if (response.ok && !result.errors) {
                setRating(0);
                setReviewContent('');
                setIsAnonymous(false);
                alert('Review submitted successfully! It is now awaiting approval.');
            } else {
                console.error('Error submitting review:', result.errors || response.statusText);
            }
        } catch (error) {
            console.error('Error submitting review:', error);
        }
    };

    return (
        <div className="container mx-auto my-4 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-8 shadow-lg rounded-lg border-t-4 border-yellow-500">
                    <div className="flex items-center mb-4">
                        <i className="bi bi-star text-yellow-500 text-3xl mr-2"></i>
                        <h2 className="text-3xl font-bold">Leave a Review</h2>
                    </div>

                    {business && (
                        <p className="text-gray-600 mb-4">Share your experience with <strong>{business.name}</strong>!</p>
                    )}

                    <form onSubmit={handleReviewSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-lg mb-2">Rating</label>
                            <div className="flex items-center space-x-2">
                                {Array.from({ length: 5 }, (_, index) => (
                                    <button
                                        type="button"
                                        key={index}
                                        onClick={() => setRating(index + 1)}
                                        className={`text-3xl ${index < rating ? 'text-yellow-500' : 'text-gray-400'}`}
                                    >
                                        ★
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-lg mb-2" htmlFor="reviewContent">
                                Your Review
                            </label>
                            <textarea
                                id="reviewContent"
                                className="w-full p-3 border rounded-md focus:border-yellow-500 focus:ring-yellow-500"
                                placeholder="Share your thoughts about this business"
                                rows="4"
                                value={reviewContent}
                                onChange={(e) => setReviewContent(e.target.value)}
                                required
                            ></textarea>
                        </div>

                        <div className="flex items-center mb-4">
                            <input
                                type="checkbox"
                                id="anonymous"
                                className="mr-2"
                                checked={isAnonymous}
                                onChange={(e) => setIsAnonymous(e.target.checked)}
                            />
                            <label htmlFor="anonymous" className="text-gray-700">Submit anonymously</label>
                        </div>

                        <button type="submit" className="bg-gradient-to-r from-yellow-500 to-yellow-700 text-white px-6 py-3 rounded-full hover:shadow-lg transition duration-300 ease-in-out">
                            Submit Review
                        </button>
                    </form>
                </div>

                <div className="bg-white p-8 shadow-lg rounded-lg border-t-4 border-yellow-500">
                    <h2 className="text-2xl font-bold mb-4">All Reviews</h2>
                    <div className="overflow-y-scroll" style={{ maxHeight: '500px' }}>
                        {reviews.length > 0 ? (
                            <ul>
                                {reviews.map((review) => (
                                    <li key={review.id} className="mb-6 pb-4 border-b border-gray-200">
                                        <div className="flex items-center mb-1">
                                            <div className="flex items-center text-yellow-500">
                                                {Array.from({ length: 5 }, (_, i) => (
                                                    <i key={i} className={`bi ${i < review.rating ? 'bi-star-fill' : 'bi-star'}`}></i>
                                                ))}
                                            </div>
                                            <span className="ml-2 text-md font-semibold text-gray-700">{review.rating}/5</span>
                                        </div>
                                        <div className="mb-1">
                                            <p className="text-sm text-gray-800">{review.content}</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                By: <span className="font-medium">{review.isAnonymous === 'true' ? 'Anonymous' : (review.user?.name || 'N/A')}</span>
                                                <span className="mx-2">|</span>
                                                <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                                            </p>
                                        </div>

                                        {review.replies && review.replies.length > 0 && (
                                            <div className="mt-3 pl-3 border-l-4 border-yellow-300 bg-gray-100 p-2 rounded-md shadow-sm">
                                                <h4 className="text-sm font-semibold mb-1 text-gray-600">Replies:</h4>
                                                <ul className="space-y-1">
                                                    {review.replies.map((reply, replyIndex) => (
                                                        <li key={replyIndex}>
                                                            <h5 className='text-gray-800 font-medium text-sm'>{business.name}</h5>
                                                            <p className="text-xs text-gray-700">{reply.content}</p>
                                                            <p className="text-xs text-gray-400">Posted on: {new Date(reply.createdAt).toLocaleDateString()}</p>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">No reviews yet for this business.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
