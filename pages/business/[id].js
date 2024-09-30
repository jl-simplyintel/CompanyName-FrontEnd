// keystone-frontend/pages/business/[id].js
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { subYears, subMonths, isAfter } from 'date-fns';
import Breadcrumbs from '../../components/Breadcrumbs';
import Head from 'next/head'; // Import Head for SEO

export default function BusinessDetails() {
    const router = useRouter();
    const { id } = router.query;
    const [business, setBusiness] = useState(null);

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
            setBusiness(result.data.business);
        } catch (error) {
            console.error('Error fetching business details:', error);
        }
    };

    if (!business) {
        return <p className="text-center text-gray-500 mt-10">Loading...</p>;
    }

    // Calculate average rating and total reviews
    const totalReviews = business.reviews.length;
    const averageRating = (business.reviews.reduce((sum, review) => sum + Number(review.rating), 0) / totalReviews).toFixed(1);

    // Calculate complaints closed in the last 3 years and 12 months
    const now = new Date();
    const threeYearsAgo = subYears(now, 3);
    const twelveMonthsAgo = subMonths(now, 12);
    const complaintsClosedInLast3Years = business.complaints.filter(complaint =>
        isAfter(new Date(complaint.createdAt), threeYearsAgo)
    ).length;

    const complaintsClosedInLast12Months = business.complaints.filter(complaint =>
        isAfter(new Date(complaint.createdAt), twelveMonthsAgo)
    ).length;

    // SEO keywords and meta description
    const keywords = business.keywords?.join(', ') || 'business';
    const metaDescription = `${business.name} is located in ${business.location} and operates in the ${business.industry} industry. Technologies used include ${business.technologiesUsed?.join(', ') || 'various tools'}.`;

    return (
        <div className="container mx-auto mt-10 p-4">
            {/* SEO Head */}
            <Head>
                <title>{business.name} - Business Details</title>
                <meta name="description" content={metaDescription} />
                <meta name="keywords" content={keywords} />
                <meta name="robots" content="index, follow" />
            </Head>

            <Breadcrumbs businessName={business.name} />

            {/* Business Name */}
            <h1 className="text-4xl font-bold mb-4">{business.name}</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* About Section */}
                <div className="md:col-span-2 bg-white p-8 shadow-lg rounded-lg border-t-4 border-blue-500">
                    <div className="flex items-center mb-4">
                        <i className="bi bi-info-circle text-blue-500 text-3xl mr-2"></i>
                        <h2 className="text-3xl font-bold">About {business.name}</h2>
                    </div>
                    <p className="text-gray-700 text-lg leading-relaxed">{business.description || 'No description available.'}</p>
                </div>

                {/* Contact Information */}
                <div className="bg-white p-6 shadow-lg rounded-lg border-t-4 border-teal-500">
                    <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
                    <p className="flex items-center mb-2 text-gray-700">
                        <i className="bi bi-geo-alt text-blue-500 mr-2"></i> {business.location || 'N/A'}
                    </p>
                    <p className="flex items-center mb-2 text-gray-700">
                        <i className="bi bi-envelope text-blue-500 mr-2"></i>
                        <a href={`mailto:${business.contactEmail}`} className="text-blue-500 hover:underline nofollow">Email this Business</a>
                    </p>
                    <p className="flex items-center mb-4 text-gray-700">
                        <i className="bi bi-telephone text-blue-500 mr-2"></i>
                        <a href={`tel:${business.contactPhone}`} className="text-blue-500 hover:underline nofollow">{business.contactPhone || 'N/A'}</a>
                    </p>
                </div>

            </div>

            {/* Business Details */}
            <div className="mt-8 bg-white p-8 shadow-lg rounded-lg border-t-4 border-yellow-500">
                <div className="flex items-center mb-4">
                    <i className="bi bi-briefcase text-yellow-500 text-3xl mr-2"></i>
                    <h3 className="text-2xl font-bold">Business Details</h3>
                </div>
                <p><strong>Email:</strong> {business.contactEmail || 'N/A'}</p>
                <p><strong>Telephone:</strong> {business.contactPhone || 'N/A'}</p>
                <p><strong>Location:</strong> {business.location || 'N/A'}</p>
                <p><strong>Year Founded:</strong> {business.yearFounded || 'N/A'}</p>
                <p><strong>Type of Entity:</strong> {business.typeOfEntity || 'N/A'}</p>
                <p><strong>Revenue:</strong> {business.revenue || 'N/A'}</p>
                <p><strong>Employee Count:</strong> {business.employeeCount || 'N/A'}</p>
                <p><strong>Keywords:</strong> {business.keywords || 'N/A'}</p>
                <p><strong>Technologies Used:</strong> {business.technologiesUsed || 'N/A'}</p>
            </div>

            {/* Social Media Links */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 shadow-lg rounded-lg border-t-4 border-indigo-500">
                    <h3 className="text-xl font-semibold mb-4">Social Media</h3>
                    {business.companyLinkedIn && (
                        <p className="flex items-center mb-2">
                            <i className="bi bi-linkedin text-indigo-500 mr-2"></i>
                            <a href={business.companyLinkedIn} target="_blank" rel="noopener noreferrer nofollow" className="text-blue-500 hover:underline">LinkedIn</a>
                        </p>
                    )}
                    {business.companyFacebook && (
                        <p className="flex items-center mb-2">
                            <i className="bi bi-facebook text-indigo-500 mr-2"></i>
                            <a href={business.companyFacebook} target="_blank" rel="noopener noreferrer nofollow" className="text-blue-500 hover:underline">Facebook</a>
                        </p>
                    )}
                    {business.companyTwitter && (
                        <p className="flex items-center">
                            <i className="bi bi-twitter text-indigo-500 mr-2"></i>
                            <a href={business.companyTwitter} target="_blank" rel="noopener noreferrer nofollow" className="text-blue-500 hover:underline">Twitter</a>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
