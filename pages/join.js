import { useState } from 'react';
import axios from 'axios';

export default function Join() {
  const [formData, setFormData] = useState({
    firstName: '', surname: '', email: '', linkedIn: '',
    jobTitle: '', company: '', location: '', description: '',
    motivation: '', goals: '', experience: '', angel: '', areas: []
  });
  const [submitted, setSubmitted] = useState(false);

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
    try {
      await axios.post('/api/submit-investor', formData);
      setSubmitted(true);
    } catch (err) {
      console.error('Submission failed', err);
    }
  };

  if (submitted) return <p className="p-4">Thank you! Check your email for a welcome message.</p>;

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-2xl mb-4">Join CivilizationX</h2>
      <input name="firstName" placeholder="First Name" onChange={handleChange} className="border p-2 mb-2 w-full" />
      <input name="surname" placeholder="Surname" onChange={handleChange} className="border p-2 mb-2 w-full" />
      <input name="email" placeholder="Email Address" onChange={handleChange} className="border p-2 mb-2 w-full" />
      <input name="linkedIn" placeholder="LinkedIn" onChange={handleChange} className="border p-2 mb-2 w-full" />
      <input name="jobTitle" placeholder="Job Title" onChange={handleChange} className="border p-2 mb-2 w-full" />
      <input name="company" placeholder="Company" onChange={handleChange} className="border p-2 mb-2 w-full" />
      <input name="location" placeholder="Location" onChange={handleChange} className="border p-2 mb-2 w-full" />
      <textarea name="description" placeholder="Tell us about yourself" onChange={handleChange} className="border p-2 mb-2 w-full" />
      <textarea name="motivation" placeholder="What's your motivation to join CivilizationX?" onChange={handleChange} className="border p-2 mb-2 w-full" />
      <textarea name="goals" placeholder="What do you hope to get out of becoming a member?" onChange={handleChange} className="border p-2 mb-2 w-full" />
      <input name="experience" placeholder="Investment Experience" onChange={handleChange} className="border p-2 mb-2 w-full" />
      <input name="angel" placeholder="Angel Investment Made? (Yes/No)" onChange={handleChange} className="border p-2 mb-2 w-full" />
      <p className="mt-2 mb-1">Investment Areas:</p>
      {[
        "Machine Learning Operations", "Artificial Intelligence (AI)", "Quantum Computing",
        "Energy Storage and Advanced Batteries", "Cloud Infrastructure",
        "Foundational Models", "Data Storage and Management", "Computing Hardware", "None of the above"
      ].map(area => (
        <label key={area} className="block">
          <input type="checkbox" name="areas" value={area} onChange={handleChange} />
          {` ${area}`}
        </label>
      ))}
      <button onClick={handleSubmit} className="bg-black text-white px-4 py-2 mt-4">Submit</button>
    </div>
  );
}

