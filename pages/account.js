// pages\account.js
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

const Account = () => {
    const { data: session } = useSession();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState(''); // State for feedback messages

    useEffect(() => {
        if (session?.user?.id) {
            console.log('Session User ID:', session.user.id); // Log the session user ID
            fetchUserData(session.user.id);
        } else {
            console.error('Session does not contain a user ID.');
        }
    }, [session]);

    // Function to fetch user data from GraphQL API
    const fetchUserData = async (userId) => {
        try {
            const query = `
            query GetUser($where: UserWhereUniqueInput!) {
              user(where: $where) {
                id
                name
                email
              }
            }
          `;

            const response = await fetch('http://localhost:3001/api/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: query,
                    variables: { where: { id: userId } }, // Use `where` with an object containing `id`
                }),
            });

            const result = await response.json();

            // Log the entire GraphQL response to inspect it
            console.log('GraphQL response:', result);

            if (result.data && result.data.user) {
                setName(result.data.user.name);
                setEmail(result.data.user.email);
            } else {
                console.error('GraphQL errors:', result.errors);
                setMessage('Error fetching user data. Please check the console for details.');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            setMessage('An error occurred while fetching user data.');
        }
    };

    // Function to handle profile update
    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        

        try {
            const mutation = `
            mutation UpdateUser($where: UserWhereUniqueInput!, $data: UserUpdateInput!) {
                updateUser(where: $where, data: $data) {
                    id
                    name
                    email
                    }
                }
            `;

            const response = await fetch('http://localhost:3001/api/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: mutation,
                    variables: {
                        where: {
                            id: session.user.id,
                        },
                        data: {
                            name: name,
                            email: email,
                        },
                    },
                }),
            });

            const result = await response.json();
            console.log('GraphQL response:', result); // Debugging

            if (result.errors) {
                setMessage('Error updating profile. Please try again.');
            } else {
                setMessage('Profile updated successfully!');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setMessage('An error occurred. Please try again.');
        }
    };

    // Function to handle password change
// Function to handle password change
const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      const mutation = `
        mutation UpdateUser($id: ID!, $password: String!) {
          updateUser(where: { id: $id }, data: { password: $password }) {
            id
          }
        }
      `;
  
      const response = await fetch('http://localhost:3001/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: mutation,
          variables: {
            id: session.user.id, // The ID of the user to update
            password: newPassword, // New password from your form
          },
        }),
      });
  
      const result = await response.json();
      if (result.errors) {
        setMessage('Error changing password. Please try again.');
      } else {
        setMessage('Password changed successfully!');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setMessage('An error occurred. Please try again.');
    }
  };
  

    if (!session) {
        return (
            <div className="container mx-auto p-6">
                <p className="text-center text-lg">Please log in to manage your account.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-4xl font-bold mb-8 text-center">Manage Your Account</h1>
            {message && <p className="text-center text-green-500 mb-4">{message}</p>}

            {/* Profile Information */}
            <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
                <h2 className="text-2xl font-bold mb-4">Your Profile</h2>
                <form onSubmit={handleProfileUpdate}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                            placeholder="Your name"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                            placeholder="Your email"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
                    >
                        Update Profile
                    </button>
                </form>
            </div>

            {/* Change Password */}
            <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
                <h2 className="text-2xl font-bold mb-4">Change Password</h2>
                <form onSubmit={handlePasswordChange}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Current Password</label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                            placeholder="Enter current password"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                            placeholder="Enter new password"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
                    >
                        Change Password
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Account;
