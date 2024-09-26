// keystone-frontend/pages/complaint/[id].js
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Breadcrumbs_Complaint from '../../components/Breadcrumbs_Complaint';

export default function ComplaintPage() {
    const router = useRouter();
    const { id } = router.query;
    const [business, setBusiness] = useState(null);
    const [subject, setSubject] = useState('');
    const [complaintContent, setComplaintContent] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { data: session } = useSession();

    useEffect(() => {
        if (id && session) {
            fetchBusinessComplaints(id, session.user.id);
        }
    }, [id, session]);

    // Fetch complaints data
    const fetchBusinessComplaints = async (businessId) => {
        try {
            const query = `
            {
              business(where: { id: "${businessId}" }) {
                name
                complaints(where: {
                  status: { equals: "0" }
                }) {
                  subject
                  content
                  isAnonymous
                  status
                  createdAt
                  user {
                    name
                  }
                  replies {
                    content
                    createdAt
                  }
                }
              }
            }`;

            const response = await fetch('https://lightyellow-reindeer-503269.hostingersite.com/api/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query }),
            });

            const result = await response.json();
            setBusiness(result.data.business);
        } catch (error) {
            console.error('Error fetching business complaints:', error);
        }
    };

    const handleComplaintSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Check if the user is authenticated before submitting the complaint
        if (!session) {
            router.push('/auth/signin'); // Redirect to login page if not authenticated
            setIsSubmitting(false);
            return;
        }

        try {
            const mutation = `
                mutation CreateComplaint($subject: String!, $content: String!, $businessId: ID!, $userId: ID!, $isAnonymous: String!, $status: String!) {
                    createComplaint(data: {
                        subject: $subject,
                        content: $content,
                        business: { connect: { id: $businessId } },
                        user: { connect: { id: $userId } },
                        isAnonymous: $isAnonymous,
                        status: $status
                    }) {
                        id
                    }
                }
            `;

            // Set up variables for the mutation
            const variables = {
                subject,
                content: complaintContent,
                businessId: id,
                userId: session.user.id,
                isAnonymous: isAnonymous ? 'true' : 'false',
                status: '1', // Default to 'Pending'
            };

            const response = await fetch('https://companynameadmin-008a72cce60a.herokuapp.com/api/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: mutation, variables }),
            });

            const result = await response.json();

            // Handle the response
            if (response.ok && !result.errors) {
                setSubject('');
                setComplaintContent('');
                setIsAnonymous(false);
                fetchBusinessComplaints(id, session.user.id); // Refresh the complaints list
                alert('Complaint submitted successfully! It will be reviewed soon.');
            } else {
                console.error('Error submitting complaint:', result.errors || response.statusText);
            }
        } catch (error) {
            console.error('Error submitting complaint:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto mt-10 p-4">
            {/* Pass the business name to the breadcrumbs */}
            <Breadcrumbs_Complaint businessName={business ? business.name : ''} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Submit a Complaint Section */}
                <div className="bg-white p-8 shadow-lg rounded-lg border-t-4 border-red-500">
                    <div className="flex items-center mb-4">
                        <i className="bi bi-exclamation-circle text-red-500 text-3xl mr-2"></i>
                        <h2 className="text-3xl font-bold">Submit a Complaint</h2>
                    </div>

                    {business && (
                        <p className="text-gray-600 mb-4">Report your experience with <strong>{business.name}</strong>.</p>
                    )}

                    <form onSubmit={handleComplaintSubmit}>
                        {/* Subject Input */}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-lg mb-2" htmlFor="complaintSubject">
                                Subject
                            </label>
                            <input
                                type="text"
                                id="complaintSubject"
                                className="w-full p-3 border rounded-md focus:border-red-500 focus:ring-red-500"
                                placeholder="Enter the subject of your complaint"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                required
                            />
                        </div>

                        {/* Complaint Content */}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-lg mb-2" htmlFor="complaintContent">
                                Your Complaint
                            </label>
                            <textarea
                                id="complaintContent"
                                className="w-full p-3 border rounded-md focus:border-red-500 focus:ring-red-500"
                                placeholder="Describe the issue"
                                rows="4"
                                value={complaintContent}
                                onChange={(e) => setComplaintContent(e.target.value)}
                                required
                            ></textarea>
                        </div>

                        {/* Submit Anonymously */}
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

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="bg-gradient-to-r from-red-500 to-red-700 text-white px-6 py-3 rounded-full hover:shadow-lg transition duration-300 ease-in-out"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
                        </button>
                    </form>
                </div>

                {/* All Complaints Section */}
                <div className="bg-white p-8 shadow-lg rounded-lg border-t-4 border-red-500">
                    <h2 className="text-2xl font-bold mb-4">Your Complaints</h2>
                    <div className="overflow-y-scroll" style={{ maxHeight: '500px' }}>
                        {business ? (
                            business.complaints.length > 0 ? (
                                <ul>
                                    {business.complaints.map((complaint, index) => (
                                        <li key={index} className="mb-4 border-b pb-4">
                                            <p className="font-bold text-gray-700">Subject: {complaint.subject}</p>
                                            <p className="text-gray-700">{complaint.content}</p>
                                            <p className="text-sm text-gray-500 mt-1">By: {complaint.isAnonymous ? 'Anonymous' : complaint.user.name}</p>
                                            <p className="text-sm text-gray-500">Status: {complaint.status === '0' ? 'Closed' : 'Pending'}</p>

                                            {/* Display Replies */}
                                            {complaint.replies && complaint.replies.length > 0 && (
                                                <div className="mt-4 pl-4 border-l-2 border-gray-300">
                                                    <h4 className="text-lg font-semibold mb-2">Replies:</h4>
                                                    <ul>
                                                        {complaint.replies.map((reply, replyIndex) => (
                                                            <li key={replyIndex} className="mb-2">
                                                                <h5 className='text-gray-900'>{business.name}</h5>
                                                                <p className="text-gray-700">{reply.content}</p>
                                                                <p className="text-sm text-gray-500">Posted on: {new Date(reply.createdAt).toLocaleDateString()}</p>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No complaints for this business.</p>
                            )
                        ) : (
                            <p>Loading complaints...</p>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
