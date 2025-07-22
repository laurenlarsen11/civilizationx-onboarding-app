// pages/index.js
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [greeting, setGreeting] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setGreeting(`Hello, ${data.firstName}`);
        setTimeout(() => {
          router.push('https://investor-workflow-ui.vercel.app');
        }, 1500); // show greeting briefly before redirect
      } else {
        alert('Email not recognized. Try joining as a member.');
      }
    } catch (err) {
      console.error('Login failed', err);
      alert('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md text-center">
        <h1 className="text-2xl font-semibold mb-4">Welcome to CivilizationX</h1>

        {greeting ? (
          <p className="text-green-600 text-xl mb-4">{greeting}</p>
        ) : (
          <>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-md mb-4"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </>
        )}

        <div className="mt-4">
          <button
            onClick={() => router.push('/join')}
            className="text-sm text-blue-600 hover:underline"
          >
            Join as Member
          </button>
        </div>
      </div>
    </div>
  );
}



