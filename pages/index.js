import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/check-member', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.found) {
        setMessage(`Hello, ${data.firstName}! Redirecting...`);
        setTimeout(() => {
          window.location.href = 'https://investor-workflow-ui.vercel.app';
        }, 2000);
      } else {
        router.push('/join');
      }
    } catch (error) {
      console.error('Login error:', error);
      setMessage('Something went wrong. Please try again.');
    }

    setLoading(false);
  };

  const handleJoin = () => {
    router.push('/join');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1869c2] to-[#021d39] flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Welcome to CivilizationX</h1>
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition mb-2"
          disabled={loading}
        >
          {loading ? 'Checking...' : 'Login'}
        </button>
        <button
          onClick={handleJoin}
          className="text-blue-600 hover:underline text-sm"
        >
          Join as Member
        </button>

        {message && <p className="mt-4 text-gray-700">{message}</p>}
      </div>
    </div>
  );
}




