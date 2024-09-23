import { signIn, useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { status } = useSession();
  const router = useRouter();

  // Get the `callbackUrl` or fallback to `/`
  const { callbackUrl } = router.query;
  
  // Redirect if the user is already authenticated
  useEffect(() => {
    if (status === 'authenticated') {
      router.push(callbackUrl || '/');
    }
  }, [status, router, callbackUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    console.log('Form submitted with:', { email, password });

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result.error) {
        console.error('Authentication failed:', result.error);
        setError('Unable to log in. Please try again.');
      } else {
        console.log('Authentication successful. Redirecting...');
        router.push(callbackUrl || '/');
      }
    } catch (err) {
      console.error('Error during login:', err);
      setError('Something went wrong. Please try again.');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600">
      <div className="max-w-md w-full bg-white shadow-xl rounded-lg p-8">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-6">SimplyGroup Login</h2>
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className={`w-full py-2 px-4 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200 ${isLoading ? 'bg-purple-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'
              }`}
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link href="/forgot-password" className="text-sm text-purple-600 hover:underline">
            Forgot your password?
          </Link>
        </div>
        <div className="mt-2 text-center">
          <Link href="/auth/register" className="text-sm text-purple-600 hover:underline">
            Don&apos;t have an account? Register here
          </Link>
        </div>
        <p className="mt-6 text-sm text-center text-gray-600">
          &copy; {new Date().getFullYear()} SimplyGroup. All rights reserved.
        </p>
      </div>
    </div>
  );
}
