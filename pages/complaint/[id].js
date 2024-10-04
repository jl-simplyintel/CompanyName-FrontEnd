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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [complaintsLoaded, setComplaintsLoaded] = useState(5); // Load 5 complaints initially

  useEffect(() => {
    if (id && session?.user) {
      fetchBusinessComplaints(id, complaintsLoaded);
    }
  }, [id, session, complaintsLoaded]);

  // Fetch complaints data with pagination
  const fetchBusinessComplaints = async (businessId, first = 5, skip = 0) => {
    setLoading(true); // Show loading skeleton during data fetching
    try {
      const query = `
        query GetBusinessComplaints($id: ID!, $first: Int, $skip: Int) {
          business(where: { id: $id }) {
            name
            complaints(first: $first, skip: $skip, where: { status: { equals: "0" } }) {
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
        }
      `;

      const variables = { id: businessId, first, skip };

      const response = await fetch(process.env.NEXT_PUBLIC_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, variables }),
      });

      const result = await response.json();
      if (result.errors) {
        setError('Error fetching complaints data.');
        console.error(result.errors);
      } else {
        setBusiness(result.data.business);
      }
    } catch (error) {
      setError('Failed to load complaints.');
      console.error('Error fetching business complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleComplaintSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!session) {
      router.push('/auth/signin');
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

      const variables = {
        subject,
        content: complaintContent,
        businessId: id,
        userId: session.user.id,
        isAnonymous: isAnonymous ? 'true' : 'false',
        status: '1', // Pending status
      };

      const response = await fetch(process.env.NEXT_PUBLIC_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: mutation, variables }),
      });

      const result = await response.json();
      if (result.errors) {
        console.error('Error submitting complaint:', result.errors);
      } else {
        setSubject('');
        setComplaintContent('');
        setIsAnonymous(false);
        fetchBusinessComplaints(id, complaintsLoaded); // Refresh the complaints list
        alert('Complaint submitted successfully!');
      }
    } catch (error) {
      console.error('Error submitting complaint:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const loadMoreComplaints = () => {
    setComplaintsLoaded((prev) => prev + 5); // Load 5 more complaints
  };

  if (loading) {
    return (
      <div className="p-8 bg-white shadow-lg rounded-lg">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-5/6 mb-4"></div>
        </div>
      </div>
    );
  }

  if (error) return <p>{error}</p>;

  return (
    <div className="container mx-auto mt-10 p-4">
      <Breadcrumbs_Complaint businessName={business ? business.name : ''} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Submit a Complaint Section */}
        <div className="bg-white p-8 shadow-lg rounded-lg border-t-4 border-red-500">
          <div className="flex items-center mb-4">
            <i className="bi bi-exclamation-circle text-red-500 text-3xl mr-2"></i>
            <h2 className="text-3xl font-bold">Submit a Complaint</h2>
          </div>

          {business && (
            <p className="text-gray-600 mb-4">
              Report your experience with <strong>{business.name}</strong>.
            </p>
          )}

          <form onSubmit={handleComplaintSubmit}>
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

          {/* Load More Button */}
          {business?.complaints.length > 0 && (
            <button
              className="mt-4 text-blue-500"
              onClick={loadMoreComplaints}
            >
              Load More Complaints
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
