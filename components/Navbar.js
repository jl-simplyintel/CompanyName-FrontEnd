import React from 'react';
import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';

const Navbar = () => {
  const { data: session } = useSession();

  return (
    <nav className="bg-gray-800 p-4 shadow-md w-full">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="text-white text-2xl font-bold">
          <Link href="/">
            <button className="focus:outline-none text-white">
              Simply<span className="text-blue-500">Group</span>
            </button>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center space-x-4">
          <Link href="/businesses">
            <button className="text-white hover:text-blue-500 transition duration-300 focus:outline-none">
              Businesses
            </button>
          </Link>

          {/* User Info and Login/Logout Button */}
          {session ? (
            <div className="flex items-center space-x-4">
              {/* Link to the account management page */}
              <Link href="/account">
                <span className="text-white hover:text-blue-500 cursor-pointer transition duration-300">
                  Welcome, {session.user.name || session.user.email}
                </span>
              </Link>
              
              <button
                onClick={() => signOut()}
                className="text-white bg-blue-500 px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 focus:outline-none"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => signIn()}
              className="text-white bg-blue-500 px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 focus:outline-none"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
