import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react'; // Import useSession
import '../../components/Breadcrumbs_Quote';
import Breadcrumbs from '../../components/Breadcrumbs';
import Breadcrumbs_Quote from '../../components/Breadcrumbs_Quote';

export default function QuotePage() {
    const router = useRouter();
    const { id } = router.query;
    const [business, setBusiness] = useState(null);
    const [service, setService] = useState('');
    const [message, setMessage] = useState('');
    const { data: session } = useSession(); // Get session data (no need to use status for this case)

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
                name
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

    const handleQuoteSubmit = async (e) => {
        e.preventDefault();

        // Check if the user is authenticated before submitting the form
        if (!session) {
            router.push('/auth/signin'); // Redirect to login page if not authenticated
            return;
        }

        try {
            // Log the variables to debug
            console.log('Submitting Quote with:', {
                service,
                message,
                business: id,
                user: session.user.id,
                status: 'pending', // Default status
            });

            const mutation = `
            mutation CreateQuote($service: String!, $message: String!, $businessId: ID!, $userId: ID!, $status: String!) {
                createQuote(data: {
                    service: $service,
                    message: $message,
                    business: { connect: { id: $businessId } },
                    user: { connect: { id: $userId } },
                    status: $status
                }) {
                    id
                }
            }
        `;


            const variables = {
                service,
                message,
                businessId: id,
                userId: session.user.id,
                status: 'pending', // Automatically set status to pending
            };

            const response = await fetch('http://localhost:3001/api/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: mutation, variables }),
            });

            const result = await response.json();

            if (response.ok && !result.errors) {
                setService('');
                setMessage('');
                alert('Quote request submitted successfully!');
            } else {
                console.error('Error submitting quote:', result.errors || response.statusText);
            }
        } catch (error) {
            console.error('Error submitting quote:', error);
        }
    };

    return (
        <div className="container mx-auto mt-10 p-4">
            <Breadcrumbs_Quote businessName={business}/>
            <h1 className="text-3xl font-bold mb-4">Request a Quote for {business ? business.name : 'Loading...'}</h1>
            <div className="bg-white p-8 shadow-lg rounded-lg border-t-4 border-purple-600">
                <form onSubmit={handleQuoteSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-lg mb-2" htmlFor="service">
                            Service Required
                        </label>
                        <input
                            type="text"
                            id="service"
                            className="w-full p-2 border rounded-md focus:border-purple-500 focus:ring-purple-500"
                            value={service}
                            onChange={(e) => setService(e.target.value)}
                            placeholder="Specify the service you're interested in"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-lg mb-2" htmlFor="message">
                            Message
                        </label>
                        <textarea
                            id="message"
                            className="w-full p-2 border rounded-md focus:border-purple-500 focus:ring-purple-500"
                            rows="4"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Provide additional details about your request"
                            required
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        className="bg-gradient-to-r from-purple-500 to-purple-700 text-white px-6 py-2 rounded-full hover:bg-purple-800 transition duration-300"
                    >
                        Submit Quote
                    </button>
                </form>
            </div>
        </div>
    );
}
