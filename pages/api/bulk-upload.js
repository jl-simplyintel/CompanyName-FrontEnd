// pages\api\bulk-upload.js
import { getSession } from 'next-auth/react';
import { v4 as uuidv4 } from 'uuid';
import { gql, GraphQLClient } from 'graphql-request';

const handler = async (req, res) => {
    const session = await getSession({ req });

    // Debugging logs to check the session
    console.log('Session:', session);

    // Check if the user is authenticated and has an 'admin' role
    if (!session || session.user.role !== 'admin') {
        console.log('Access Denied: User is not authenticated or not an admin');
        return res.status(403).json({ message: 'Access denied' });
    }

    // Handle only POST requests
    if (req.method === 'POST') {
        const { businesses } = req.body;

        if (!Array.isArray(businesses)) {
            return res.status(400).json({ message: 'Invalid data format. Expected an array.' });
        }

        try {
            // GraphQL client setup
            const endpoint = 'https://lightslategray-mink-295930.hostingersite.com/api/graphql';
            const graphQLClient = new GraphQLClient(endpoint, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // GraphQL mutation to create a business
            const mutation = gql`
                mutation CreateBusiness($data: BusinessCreateInput!) {
                    createBusiness(data: $data) {
                        id
                    }
                }
            `;

            // Iterate over businesses and create each one
            for (const business of businesses) {
                const data = {
                    id: uuidv4(),
                    name: business.name,
                    description: business.description,
                    industry: business.industry,
                    contactEmail: business.contactEmail,
                    contactPhone: business.contactPhone,
                    website: business.website,
                    location: business.location,
                    address: business.address,
                    yearFounded: business.yearFounded,
                    typeOfEntity: business.typeOfEntity,
                    businessHours: business.businessHours,
                    revenue: business.revenue,
                    employeeCount: business.employeeCount,
                    keywords: business.keywords,
                    companyLinkedIn: business.companyLinkedIn,
                    companyFacebook: business.companyFacebook,
                    companyTwitter: business.companyTwitter,
                    technologiesUsed: business.technologiesUsed,
                    sicCodes: business.sicCodes,
                    manager: { connect: { id: business.manager } },
                };

                await graphQLClient.request(mutation, { data });
            }

            res.status(200).json({ message: 'Businesses uploaded successfully!' });
        } catch (error) {
            console.error('Error uploading businesses:', error);
            res.status(500).json({ message: 'An error occurred during the upload.' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
};

export default handler;
