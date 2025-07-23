import { useState } from 'react';
import axios from 'axios';
import Head from 'next/head';

export default function Join() {
  const [formData, setFormData] = useState({
    firstName: '', surname: '', email: '', linkedIn: '',
    jobTitle: '', company: '', location: '', description: '',
    motivation: '', goals: '', experience: '', angel: '', areas: []
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        areas: checked
          ? [...prev.areas, value]
          : prev.areas.filter(area => area !== value)
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    setError('');
    try {
      await axios.post('/api/submit-investor', formData);
      setSubmitted(true);
    } catch (err) {
      console.error('Submit error:', err);
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <>
      <Head>
        <title>Join CivilizationX</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600&family=Bebas+Neue&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-[#1869c2] to-[#021d39] flex items-center justify-center px-4 py-10">
        <div className="bg-white bg-opacity-90 p-8 rounded-2xl shadow-xl w-full max-w-2xl">
          {submitted ? (
            <h2 className="text-xl text-center text-green-700 font-semibold font-[Manrope]">
              Thank you! Check your email for a welcome message.
            </h2>
          ) : (
            <>
              <h2 className="text-3xl text-center font-bold mb-6" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                Join CivilizationX
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-[Manrope]">
                <input name="firstName" placeholder="First Name" onChange={handleChange} className="input" />
                <input name="surname" placeholder="Surname" onChange={handleChange} className="input" />
                <input name="email" placeholder="Email Address" onChange={handleChange} className="input" />
                <input name="linkedIn" placeholder="LinkedIn" onChange={handleChange} className="input" />
                <input name="jobTitle" placeholder="Job Title" onChange={handleChange} className="input" />
                <input name="company" placeholder="Company" onChange={handleChange} className="input" />
                <input name="location" placeholder="Location" onChange={handleChange} className="input" />
              </div>

              <textarea name="description" placeholder="Tell us about yourself" onChange={handleChange} className="input mt-4" />
              <textarea name="motivation" placeholder="What's your motivation to join CivilizationX?" onChange={handleChange} className="input mt-2" />
              <textarea name="goals" placeholder="What do you hope to get out of becoming a member?" onChange={handleChange} className="input mt-2" />
              <input name="experience" placeholder="Investment Experience" onChange={handleChange} className="input mt-2" />
              <input name="angel" placeholder="Angel Investment Made? (Yes/No)" onChange={handleChange} className="input mt-2" />

              <p className="mt-4 mb-2 font-semibold">Investment Areas:</p>
              {[
                "Machine Learning Operations", "Artificial Intelligence (AI)", "Quantum Computing",
                "Energy Storage and Advanced Batteries", "Cloud Infrastructure",
                "Foundational Models", "Data Storage and Management", "Computing Hardware", "None of the above"
              ].map(area => (
                <label key={area} className="block font-[Manrope]">
                  <input type="checkbox" name="areas" value={area} onChange={handleChange} className="mr-2" />
                  {area}
                </label>
              ))}

              <button
                onClick={handleSubmit}
                className="w-full bg-[#1869c2] hover:bg-[#145aa1] text-white font-semibold py-2 px-4 rounded-full transition-all mt-6"
              >
                Submit
              </button>

              {error && <p className="text-red-500 mt-3 text-center">{error}</p>}
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 8px;
          font-family: Manrope, sans-serif;
        }
      `}</style>
    </>
  );
}


