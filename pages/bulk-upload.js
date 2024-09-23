//pages\bulk-upload.js
import { useState } from 'react';
import Papa from 'papaparse'; // Import PapaParse for CSV parsing
import { v4 as uuidv4 } from 'uuid'; // Import UUID
import { getSession } from 'next-auth/react'; // Server-side function to check if the user is an admin

export async function getServerSideProps(context) {
    const session = await getSession(context);

    // Check if the user is authenticated and has the 'admin' role
    if (!session || session.user.role !== 'admin') {
        return {
            redirect: {
                destination: '/auth/signin',
                permanent: false,
            },
        };
    }

    return {
        props: { session },
    };
}

export default function BulkUpload() {
    const [file, setFile] = useState(null);
    const [data, setData] = useState([]);
    const [message, setMessage] = useState('');

    const downloadCSVTemplate = () => {
        const headers = [
            'id',
            'name',
            'description',
            'industry',
            'contactEmail',
            'contactPhone',
            'website',
            'location',
            'address',
            'yearFounded',
            'typeOfEntity',
            'businessHours',
            'revenue',
            'employeeCount',
            'keywords',
            'companyLinkedIn',
            'companyFacebook',
            'companyTwitter',
            'technologiesUsed',
            'sicCodes',
            'manager',
        ];

        const csvContent = `data:text/csv;charset=utf-8,${headers.join(',')}\n`;
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'businesses_template.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleParse = () => {
        if (!file) {
            setMessage('Please select a file to parse.');
            return;
        }
    
        if (file.type === 'application/json') {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const jsonData = JSON.parse(event.target.result);
                    const mappedData = jsonData.map((business) => ({
                        id: uuidv4(),
                        name: business.name || '',
                        description: business.description || '',
                        industry: business.industry || 'other',
                        contactEmail: business.contactEmail || '',
                        contactPhone: business.contactPhone ? parseInt(business.contactPhone, 10) || 0 : 0,
                        website: business.website || '',
                        location: business.location || '',
                        address: business.address || '',
                        yearFounded: business.yearFounded ? parseInt(business.yearFounded, 10) || 0 : 0,
                        typeOfEntity: business.typeOfEntity || 'LLC',
                        businessHours: business.businessHours || '',
                        revenue: business.revenue ? parseInt(business.revenue, 10) || 0 : 0,
                        employeeCount: business.employeeCount ? parseInt(business.employeeCount, 10) || 0 : 0,
                        keywords: business.keywords || '',
                        companyLinkedIn: business.companyLinkedIn || '',
                        companyFacebook: business.companyFacebook || '',
                        companyTwitter: business.companyTwitter || '',
                        technologiesUsed: business.technologiesUsed || '',
                        sicCodes: business.sicCodes ? parseInt(business.sicCodes, 10) || 0 : 0,
                        manager: business.manager || '',
                    }));
                    setData(mappedData);
                } catch (error) {
                    setMessage('Invalid JSON format.');
                }
            };
            reader.readAsText(file);
        } else if (file.type === 'text/csv') {
            Papa.parse(file, {
                header: true,
                complete: (result) => {
                    const mappedData = result.data.map((business) => ({
                        id: uuidv4(),
                        name: business.name || '',
                        description: business.description || '',
                        industry: business.industry || 'other',
                        contactEmail: business.contactEmail || '',
                        contactPhone: business.contactPhone ? parseInt(business.contactPhone, 10) || 0 : 0,
                        website: business.website || '',
                        location: business.location || '',
                        address: business.address || '',
                        yearFounded: business.yearFounded ? parseInt(business.yearFounded, 10) || 0 : 0,
                        typeOfEntity: business.typeOfEntity || 'LLC',
                        businessHours: business.businessHours || '',
                        revenue: business.revenue ? parseInt(business.revenue, 10) || 0 : 0,
                        employeeCount: business.employeeCount ? parseInt(business.employeeCount, 10) || 0 : 0,
                        keywords: business.keywords || '',
                        companyLinkedIn: business.companyLinkedIn || '',
                        companyFacebook: business.companyFacebook || '',
                        companyTwitter: business.companyTwitter || '',
                        technologiesUsed: business.technologiesUsed || '',
                        sicCodes: business.sicCodes ? parseInt(business.sicCodes, 10) || 0 : 0,
                        manager: business.manager || '',
                    }));
                    setData(mappedData);
                },
                error: () => {
                    setMessage('Error parsing CSV file.');
                },
            });
        } else {
            setMessage('Unsupported file format. Please upload a CSV or JSON file.');
        }
    };
    

    const handleEditChange = (index, field, value) => {
        const updatedData = [...data];
        updatedData[index][field] = value;
        setData(updatedData);
    };

    const handleUpload = async () => {
        try {
            const res = await fetch('http://localhost:3001/api/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: `
                        mutation($data: [BusinessCreateInput!]!) {
                            createBusinesses(data: $data) {
                                id
                            }
                        }
                    `,
                    variables: { data },
                }),
            });

            const result = await res.json();

            if (result.errors) {
                setMessage('An error occurred during the upload.');
                console.error(result.errors);
            } else {
                setMessage('Businesses uploaded successfully!');
            }
        } catch (error) {
            setMessage('An error occurred during the upload.');
            console.error('Upload error:', error);
        }
    };
    return (
        <div className="container mx-auto mt-10 p-6 bg-gray-100 rounded-lg shadow-md ">
            <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">Bulk Upload Businesses</h1>

            {/* Download CSV Template Button */}
            <div className="flex justify-center mb-4">
                <button
                    onClick={downloadCSVTemplate}
                    className="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600 transition duration-200"
                >
                    Download CSV Template
                </button>
            </div>

            {message && <p className="mb-4 text-center text-red-500">{message}</p>}

            <div className="bg-white p-8 shadow-md rounded-md mb-8">
                <label className="block text-gray-700 mb-2 font-semibold">Upload CSV or JSON</label>
                <input
                    type="file"
                    accept=".csv, .json"
                    onChange={handleFileChange}
                    className="mb-4 w-full border p-2 rounded-md"
                />
                <button
                    onClick={handleParse}
                    className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition duration-200 w-full"
                >
                    Parse File
                </button>
            </div>

            {data.length > 0 && (
                <div className="bg-white p-8 shadow-md rounded-md">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">Edit Data</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-300">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 border-b text-left">ID</th>
                                    <th className="py-2 px-4 border-b text-left">Name</th>
                                    <th className="py-2 px-4 border-b text-left">Description</th>
                                    <th className="py-2 px-4 border-b text-left">Industry</th>
                                    <th className="py-2 px-4 border-b text-left">Email</th>
                                    <th className="py-2 px-4 border-b text-left">Phone</th>
                                    <th className="py-2 px-4 border-b text-left">Website</th>
                                    <th className="py-2 px-4 border-b text-left">Location</th>
                                    <th className="py-2 px-4 border-b text-left">Address</th>
                                    <th className="py-2 px-4 border-b text-left">Year Founded</th>
                                    <th className="py-2 px-4 border-b text-left">Type of Entity</th>
                                    <th className="py-2 px-4 border-b text-left">Business Hours</th>
                                    <th className="py-2 px-4 border-b text-left">Revenue</th>
                                    <th className="py-2 px-4 border-b text-left">Employee Count</th>
                                    <th className="py-2 px-4 border-b text-left">Keywords</th>
                                    <th className="py-2 px-4 border-b text-left">LinkedIn</th>
                                    <th className="py-2 px-4 border-b text-left">Facebook</th>
                                    <th className="py-2 px-4 border-b text-left">Twitter</th>
                                    <th className="py-2 px-4 border-b text-left">Technologies Used</th>
                                    <th className="py-2 px-4 border-b text-left">SIC Codes</th>
                                    <th className="py-2 px-4 border-b text-left">Manager</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((row, index) => (
                                    <tr key={index} className="hover:bg-gray-100">
                                        <td className="py-2 px-4 border-b">{row.id}</td>
                                        <td className="py-2 px-4 border-b">
                                            <input
                                                type="text"
                                                value={row.name || ''}
                                                onChange={(e) => handleEditChange(index, 'name', e.target.value)}
                                                className="w-full p-2 border rounded"
                                            />
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            <input
                                                type="text"
                                                value={row.description || ''}
                                                onChange={(e) => handleEditChange(index, 'description', e.target.value)}
                                                className="w-full p-2 border rounded"
                                            />
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            <input
                                                type="text"
                                                value={row.industry || ''}
                                                onChange={(e) => handleEditChange(index, 'industry', e.target.value)}
                                                className="w-full p-2 border rounded"
                                            />
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            <input
                                                type="text"
                                                value={row.contactEmail || ''}
                                                onChange={(e) => handleEditChange(index, 'contactEmail', e.target.value)}
                                                className="w-full p-2 border rounded"
                                            />
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            <input
                                                type="text"
                                                value={row.contactPhone || ''}
                                                onChange={(e) => handleEditChange(index, 'contactPhone', e.target.value)}
                                                className="w-full p-2 border rounded"
                                            />
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            <input
                                                type="text"
                                                value={row.website || ''}
                                                onChange={(e) => handleEditChange(index, 'website', e.target.value)}
                                                className="w-full p-2 border rounded"
                                            />
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            <input
                                                type="text"
                                                value={row.location || ''}
                                                onChange={(e) => handleEditChange(index, 'location', e.target.value)}
                                                className="w-full p-2 border rounded"
                                            />
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            <input
                                                type="text"
                                                value={row.address || ''}
                                                onChange={(e) => handleEditChange(index, 'address', e.target.value)}
                                                className="w-full p-2 border rounded"
                                            />
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            <input
                                                type="number"
                                                value={row.yearFounded || ''}
                                                onChange={(e) => handleEditChange(index, 'yearFounded', e.target.value)}
                                                className="w-full p-2 border rounded"
                                            />
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            <input
                                                type="text"
                                                value={row.typeOfEntity || ''}
                                                onChange={(e) => handleEditChange(index, 'typeOfEntity', e.target.value)}
                                                className="w-full p-2 border rounded"
                                            />
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            <input
                                                type="text"
                                                value={row.businessHours || ''}
                                                onChange={(e) => handleEditChange(index, 'businessHours', e.target.value)}
                                                className="w-full p-2 border rounded"
                                            />
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            <input
                                                type="number"
                                                value={row.revenue || ''}
                                                onChange={(e) => handleEditChange(index, 'revenue', e.target.value)}
                                                className="w-full p-2 border rounded"
                                            />
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            <input
                                                type="number"
                                                value={row.employeeCount || ''}
                                                onChange={(e) => handleEditChange(index, 'employeeCount', e.target.value)}
                                                className="w-full p-2 border rounded"
                                            />
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            <input
                                                type="text"
                                                value={row.keywords || ''}
                                                onChange={(e) => handleEditChange(index, 'keywords', e.target.value)}
                                                className="w-full p-2 border rounded"
                                            />
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            <input
                                                type="text"
                                                value={row.companyLinkedIn || ''}
                                                onChange={(e) => handleEditChange(index, 'companyLinkedIn', e.target.value)}
                                                className="w-full p-2 border rounded"
                                            />
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            <input
                                                type="text"
                                                value={row.companyFacebook || ''}
                                                onChange={(e) => handleEditChange(index, 'companyFacebook', e.target.value)}
                                                className="w-full p-2 border rounded"
                                            />
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            <input
                                                type="text"
                                                value={row.companyTwitter || ''}
                                                onChange={(e) => handleEditChange(index, 'companyTwitter', e.target.value)}
                                                className="w-full p-2 border rounded"
                                            />
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            <input
                                                type="text"
                                                value={row.technologiesUsed || ''}
                                                onChange={(e) => handleEditChange(index, 'technologiesUsed', e.target.value)}
                                                className="w-full p-2 border rounded"
                                            />
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            <input
                                                type="text"
                                                value={row.sicCodes || ''}
                                                onChange={(e) => handleEditChange(index, 'sicCodes', e.target.value)}
                                                className="w-full p-2 border rounded"
                                            />
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            <input
                                                type="text"
                                                value={row.manager || ''}
                                                onChange={(e) => handleEditChange(index, 'manager', e.target.value)}
                                                className="w-full p-2 border rounded"
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-center mt-4">
                        <button
                            onClick={handleUpload}
                            className="bg-green-500 text-white px-6 py-2 rounded shadow hover:bg-green-600 transition duration-200"
                        >
                            Upload
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
