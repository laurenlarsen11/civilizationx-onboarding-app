import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [name, setName] = useState('');

  const checkMember = async () => {
    setStatus('Checking...');
    try {
      const res = await axios.post('/api/check-member', { email });
      if (res.data.exists) {
        setName(res.data.name);               // store first name
        setStatus('Member');                 // show "Hello, name"

        // ✅ Delay 2 seconds before redirecting
        setTimeout(() => {
          window.location.href = 'https://invest.civilizationx.co.uk/';
        }, 2000);
      } else {
        setStatus('Not a member');
      }
    } catch (e) {
      console.error(e);
      setStatus('Error checking membership');
    }
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen p-4">
      <h1 className="text-3xl mb-4">Welcome to CivilizationX</h1>
      <input
        className="border p-2 mb-2 w-full max-w-sm"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button className="bg-black text-white px-4 py-2" onClick={checkMember}>
        Login
      </button>
      <button
        className="mt-2 underline"
        onClick={() => (window.location.href = '/join')}
      >
        Join as Member
      </button>

      {status === 'Member' && (
        <p className="mt-4 text-green-700 text-lg">Hello, {name}</p>
      )}
      {status === 'Not a member' && (
        <p className="mt-4">Not found. Please join.</p>
      )}
      {status === 'Error checking membership' && (
        <p className="mt-4 text-red-500">Something went wrong.</p>
      )}
    </main>
  );
}



