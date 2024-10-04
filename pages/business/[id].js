// keystone-frontend/pages/business/[id].js
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { subYears, subMonths, isAfter } from 'date-fns';
import Breadcrumbs from '../../components/Breadcrumbs';
import Head from 'next/head'; // Import Head for SEO
import ReviewComponent from '../../components/ReviewComponent';

export default function BusinessDetails() {
    const router = useRouter();
    const { id } = router.query;
    const [business, setBusiness] = useState(null);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [loading, setLoading] = useState(true);  // Loading state to handle the initial data fetch
    const [error, setError] = useState(null); // Error state to handle API issues

    useEffect(() => {
        if (id) {
            fetchBusinessDetails(id);
        }
    }, [id]);

    const fetchBusinessDetails = async (businessId) => {
        try {
            const query = `
            {
              business(where: { id: "${businessId}" }) {
                id
                name
                description
                contactEmail
                contactPhone
                industry
                location
                yearFounded
                typeOfEntity
                revenue
                employeeCount
                keywords
                companyLinkedIn
                companyFacebook
                companyTwitter
                technologiesUsed
                reviews(where: {moderationStatus: {equals: "0" }}) {
                  rating
                  content
                }
                complaints(where: { status: {equals: "0" } }) {
                    createdAt
                }
                products {
                    id
                    name
                    description
                    images {
                        file {
                            url
                        }
                    }
                    reviews {
                        rating
                    }
                }
                jobListings {
                    id
                    title
                    description
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
            if (result.errors) {
                setError('Failed to fetch business details');
                setLoading(false);
            } else {
                setBusiness(result.data.business);
                setLoading(false); // End loading when data is fetched
            }
        } catch (error) {
            console.error('Error fetching business details:', error);
            setError('Failed to load business data.');
            setLoading(false); // End loading on error
        }
    };

    if (loading) {
        return <p className="text-center text-gray-500 mt-10">Loading...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500 mt-10">{error}</p>;
    }

    if (!business) {
        return <p className="text-center text-gray-500 mt-10">Business not found</p>;
    }

    // Calculate average rating and total reviews
    const totalReviews = business?.reviews?.length || 0;
    const averageRating = totalReviews > 0
        ? (business.reviews.reduce((sum, review) => sum + Number(review.rating), 0) / totalReviews).toFixed(1)
        : '0.0';

    // Calculate complaints closed in the last 3 years and 12 months
    const now = new Date();
    const threeYearsAgo = subYears(now, 3);
    const twelveMonthsAgo = subMonths(now, 12);
    const complaintsClosedInLast3Years = business.complaints?.filter(complaint =>
        isAfter(new Date(complaint.createdAt), threeYearsAgo)
    ).length || 0;

    const complaintsClosedInLast12Months = business.complaints?.filter(complaint =>
        isAfter(new Date(complaint.createdAt), twelveMonthsAgo)
    ).length || 0;

    // SEO keywords and meta description
    const keywords = business?.keywords || 'business'; // Use keywords as a string
    const metaDescription = `${business?.name} is located in ${business?.location} and operates in the ${business?.industry} industry. Technologies used include ${business?.technologiesUsed || 'various tools'}.`; // Use technologiesUsed as a string

    return (
        <div className="container mx-auto mt-10 p-4">
            {/* SEO Head */}
            <Head>
                <title>{business?.name} - Business Details</title>
                <meta name="description" content={metaDescription} />
                <meta name="keywords" content={keywords} />
                <meta name="robots" content="index, follow" />
            </Head>

            <Breadcrumbs businessName={business?.name} />

            {/* Business Name */}
            <h1 className="text-4xl font-bold mb-4">{business?.name}</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* About Section */}
                <div className="md:col-span-2 bg-white p-8 shadow-lg rounded-lg border-t-4 border-blue-500">
                    <div className="flex items-center mb-4">
                        <i className="bi bi-info-circle text-blue-500 text-3xl mr-2"></i>
                        <h2 className="text-3xl font-bold">About {business?.name}</h2>
                    </div>
                    <div className="text-gray-700 text-lg leading-relaxed">
                        {business?.description ? (
                            <>
                                {showFullDescription ? (
                                    <>
                                        <p>{business.description}</p>
                                        <button onClick={() => setShowFullDescription(false)} className="text-blue-500 ml-2 underline">
                                            See Less
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <p>{business.description.substring(0, 150)}...</p>
                                        <button onClick={() => setShowFullDescription(true)} className="text-blue-500 ml-2 underline">
                                            See More
                                        </button>
                                    </>
                                )}
                            </>
                        ) : (
                            <p>No description available.</p>
                        )}
                    </div>
                </div>

                {/* Customer Reviews */}
                <div className="bg-white p-6 shadow-lg rounded-lg border-t-4 border-yellow-500">
                    <h3 className="text-xl font-semibold mb-2">Customer Reviews</h3>
                    {business?.reviews && business?.reviews.length > 0 ? (
                        <>
                            <div className="flex items-center mb-2">
                                <div className="text-yellow-500">
                                    {Array.from({ length: 5 }, (_, index) => {
                                        const starFill = averageRating - index;
                                        if (starFill >= 1) {
                                            return <i key={index} className="bi bi-star-fill"></i>;
                                        } else if (starFill >= 0.5) {
                                            return <i key={index} className="bi bi-star-half"></i>;
                                        } else {
                                            return <i key={index} className="bi bi-star"></i>;
                                        }
                                    })}
                                </div>
                                <span className="ml-2 text-lg font-semibold">{averageRating}/5</span>
                            </div>
                            <p className="text-gray-600">Average of {totalReviews} Customer Review{totalReviews > 1 ? 's' : ''}</p>
                            <button
                                onClick={() => router.push(`/business/${id}#review-section`)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mt-3 transition duration-300 ease-in-out"
                            >
                                View All Reviews or Write Your Own
                            </button>
                        </>
                    ) : (
                        <>
                            <p>This business has 0 reviews</p>
                            <button
                                onClick={() => router.push(`/businness/${id}#review-section`)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mt-3 transition duration-300 ease-in-out"
                            >
                                Be the First to Review!
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Business Details with Contact Information */}
            <div className="mt-8 bg-white p-4 shadow-lg rounded-lg border-t-4 border-sky-500">
                <div className="flex items-center mb-4">
                    <i className="bi bi-briefcase text-sky-500 text-2xl mr-2"></i>
                    <h3 className="text-xl font-bold text-gray-800">Business Details and Contact Information</h3>
                </div>

                {/* Contact Information */}
                {(business?.location || business?.contactEmail || business?.contactPhone) && (
                    <div className="col-span-1 md:col-span-2 bg-gray-50 p-3 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold mb-2 text-gray-800">Contact Information</h3>
                        <div className="flex flex-col md:flex-row items-start justify-between space-y-2 md:space-y-0 md:space-x-6">

                            {/* Location */}
                            {business?.location && (
                                <p className="flex items-center text-gray-700">
                                    <i className="bi bi-geo-alt text-sky-500 text-lg mr-2 align-middle"></i>
                                    <span className="align-middle"><strong>Location:</strong> {business?.location}</span>
                                </p>
                            )}

                            {/* Email */}
                            {business?.contactEmail && (
                                <p className="flex items-center text-gray-700">
                                    <i className="bi bi-envelope text-sky-500 text-lg mr-2 align-middle"></i>
                                    <span className="align-middle">
                                        <strong>Email:</strong> <a href={`mailto:${business?.contactEmail}`} className="text-sky-600 hover:text-sky-700 hover:underline" rel="nofollow">Email this Business</a>
                                    </span>
                                </p>
                            )}

                            {/* Phone */}
                            {business?.contactPhone && (
                                <p className="flex items-center text-gray-700">
                                    <i className="bi bi-telephone text-sky-500 text-lg mr-2 align-middle"></i>
                                    <span className="align-middle">
                                        <strong>Phone:</strong> <a href={`tel:${business?.contactPhone}`} className="text-sky-600 hover:text-sky-700 hover:underline" rel="nofollow">{business?.contactPhone}</a>
                                    </span>
                                </p>
                            )}

                        </div>
                    </div>
                )}

                {/* Grid Layout for Business Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">

                    {/* Year Founded */}
                    {business?.yearFounded && (
                        <div className="flex items-center bg-gray-50 rounded-lg shadow-md p-2">
                            <i className="bi bi-calendar text-sky-500 text-lg mr-2"></i>
                            <p className="text-sm text-gray-800">
                                <strong>Year Founded:</strong> {business?.yearFounded}
                            </p>
                        </div>
                    )}

                    {/* Type of Entity */}
                    {business?.typeOfEntity && (
                        <div className="flex items-center bg-gray-50 rounded-lg shadow-md p-2">
                            <i className="bi bi-building text-sky-500 text-lg mr-2"></i>
                            <p className="text-sm text-gray-800">
                                <strong>Type of Entity:</strong> {business?.typeOfEntity}
                            </p>
                        </div>
                    )}

                    {/* Revenue */}
                    {business?.revenue && (
                        <div className="flex items-center bg-gray-50 rounded-lg shadow-md p-2">
                            <i className="bi bi-currency-dollar text-sky-500 text-lg mr-2"></i>
                            <p className="text-sm text-gray-800">
                                <strong>Revenue:</strong> {business?.revenue}
                            </p>
                        </div>
                    )}

                    {/* Employee Count */}
                    {business?.employeeCount && (
                        <div className="flex items-center bg-gray-50 rounded-lg shadow-md p-2">
                            <i className="bi bi-people text-sky-500 text-lg mr-2"></i>
                            <p className="text-sm text-gray-800">
                                <strong>Employee Count:</strong> {business?.employeeCount}
                            </p>
                        </div>
                    )}

                </div>
            </div>


            {/* Review Section */}
            <div id="review-section">
                {id && <ReviewComponent businessId={id} />}
            </div>

            {/* Products/Services */}
            <div className="mt-8 bg-white p-8 shadow-lg rounded-lg border-t-4 border-teal-400">
                <h3 className="text-2xl font-bold">Products/Services</h3>

                <div className="overflow-x-auto md:overflow-x-scroll p-4">
                    <div className="flex space-x-6 md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {business?.products?.length > 0 ? (
                            business?.products?.map((product) => (
                                <div
                                    key={product.id}
                                    className="flex-shrink-0 w-full md:w-80 bg-white p-6 shadow-lg rounded-lg hover:shadow-2xl transition-shadow duration-300"
                                >
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

                                    {/* Ratings Section */}
                                    <div className="flex flex-col items-start mb-4">
                                        <p className="text-lg font-semibold mb-1">Ratings:</p>
                                        {product.reviews.length > 0 ? (
                                            <>
                                                <div className="text-yellow-500 flex">
                                                    {Array.from({ length: 5 }, (_, index) => {
                                                        const avgRating =
                                                            product.reviews.reduce((sum, review) => sum + Number(review.rating), 0) /
                                                            product.reviews.length;
                                                        const starFill = avgRating - index;

                                                        if (starFill >= 1) {
                                                            return <i key={index} className="bi bi-star-fill"></i>;
                                                        } else if (starFill >= 0.5) {
                                                            return <i key={index} className="bi bi-star-half"></i>;
                                                        } else {
                                                            return <i key={index} className="bi bi-star"></i>;
                                                        }
                                                    })}
                                                </div>
                                                <p className="text-gray-600">
                                                    {(
                                                        product.reviews.reduce((sum, review) => sum + Number(review.rating), 0) /
                                                        product.reviews.length
                                                    ).toFixed(1)}{' '}
                                                    / 5
                                                </p>
                                            </>
                                        ) : (
                                            <p className="text-gray-500">No reviews yet</p>
                                        )}
                                    </div>

                                    <a
                                        href={`/product/${product.id}`}
                                        className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
                                        rel="nofollow"
                                        target='_blank'
                                    >
                                        Learn More
                                    </a>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">No products/services available for this business.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Other Sections */}
            <div className={`mt-8 grid grid-cols-1 ${business?.companyLinkedIn || business?.companyFacebook || business?.companyTwitter ? 'md:grid-cols-2' : 'md:grid-cols-1'} gap-6`}>
                {/* Social Media Links */}
                {(business?.companyLinkedIn || business?.companyFacebook || business?.companyTwitter) && (
                    <div className="bg-white p-6 shadow-lg rounded-lg border-t-4 border-indigo-500">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Social Media</h3>

                        {/* LinkedIn */}
                        {business?.companyLinkedIn && (
                            <p className="flex items-center mb-3 text-gray-700">
                                <i className="bi bi-linkedin text-indigo-500 text-xl mr-2"></i>
                                <a
                                    href={business?.companyLinkedIn}
                                    target="_blank"
                                    rel="noopener noreferrer nofollow"
                                    className="text-blue-500 font-medium hover:underline"
                                >
                                    LinkedIn
                                </a>
                            </p>
                        )}

                        {/* Facebook */}
                        {business?.companyFacebook && (
                            <p className="flex items-center mb-3 text-gray-700">
                                <i className="bi bi-facebook text-indigo-500 text-xl mr-2"></i>
                                <a
                                    href={business?.companyFacebook}
                                    target="_blank"
                                    rel="noopener noreferrer nofollow"
                                    className="text-blue-500 font-medium hover:underline"
                                >
                                    Facebook
                                </a>
                            </p>
                        )}

                        {/* Twitter */}
                        {business?.companyTwitter && (
                            <p className="flex items-center text-gray-700">
                                <i className="bi bi-twitter text-indigo-500 text-xl mr-2"></i>
                                <a
                                    href={business?.companyTwitter}
                                    target="_blank"
                                    rel="noopener noreferrer nofollow"
                                    className="text-blue-500 font-medium hover:underline"
                                >
                                    Twitter
                                </a>
                            </p>
                        )}
                    </div>
                )}

                {/* Customer Complaints */}
                <div className="bg-white p-6 shadow-lg rounded-lg border-t-4 border-red-500">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Customer Complaints</h3>
                    {business?.complaints && business?.complaints.length > 0 ? (
                        <>
                            <p className="text-red-600 font-semibold mb-2">{complaintsClosedInLast3Years} complaints closed in last 3 years</p>
                            <p className="text-red-600 font-semibold mb-4">{complaintsClosedInLast12Months} complaints closed in last 12 months</p>
                            <a href={`/complaint/${id}`} rel="nofollow" target='_blank'>
                                <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-300 ease-in-out">
                                    File a Complaint
                                </button>
                            </a>
                        </>
                    ) : (
                        <>
                            <p className="text-gray-700 mb-4">This business has 0 complaints.</p>
                            <a href={`/complaint/${id}`} rel="nofollow" target='_blank'>
                                <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-300 ease-in-out">
                                    File a Complaint
                                </button>
                            </a>
                        </>
                    )}
                </div>
            </div>

            {/* Job Listings Section */}
            {business?.jobListings && business.jobListings.length > 0 ? (
                <div className="mt-8 bg-white p-6 shadow rounded-lg border-t-4 border-teal-400">
                    <h3 className="text-2xl font-bold mb-4">Job Listings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {business?.jobListings?.map((listing) => (
                            <div
                                key={listing.id}
                                className="p-4 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow duration-200"
                            >
                                <h2 className="text-lg font-semibold mb-2">{listing.title}</h2>
                                <p className="text-gray-600 mb-4">
                                    {listing.description.length > 100
                                        ? `${listing.description.substring(0, 100)}...`
                                        : listing.description}
                                </p>
                                <a
                                    href={`/job/${listing.id}`}
                                    className="text-blue-500 font-semibold hover:underline"
                                    rel="nofollow"
                                >
                                    Learn More
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="mt-8 bg-gray-100 p-6 rounded-lg flex flex-col items-center justify-center shadow-md border border-gray-300">
                    <i className="bi bi-briefcase text-4xl text-gray-400 mb-3"></i>
                    <h2 className="text-xl font-bold text-gray-600">No Job Listings Available</h2>
                    <p className="text-gray-500">Currently, there are no job opportunities for this business.</p>
                </div>
            )}
            {/* Additional Information */}
            <div className="mt-8 bg-white p-8 shadow-lg rounded-lg border-t-4 border-teal-400">
                <div className="flex items-center mb-4">
                    <i className="bi bi-box-seam text-teal-400 text-3xl mr-3"></i>
                    <h3 className="text-3xl font-bold text-gray-800">Additional Information</h3>
                </div>
                <p className="text-gray-600 text-lg">Additional Information will be displayed here.</p>
            </div>
        </div>
    );
}
