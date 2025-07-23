import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

export default function Home() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [greeting, setGreeting] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    setError("");
    if (!email) {
      setError("Please enter your email.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok && data.exists) {
        setGreeting(`Hello, ${data.firstName}`);
        setTimeout(() => {
          router.push("https://investor-workflow-ui.vercel.app");
        }, 1500);
      } else {
        router.push("/join");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>CivilizationX Login</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600&family=Bebas+Neue&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#1869c2] to-[#021d39] px-4">
        <div className="bg-white bg-opacity-90 p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
          <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: "Bebas Neue, sans-serif" }}>
            Welcome to CivilizationX
          </h1>
          <p className="text-gray-700 mb-6" style={{ fontFamily: "Manrope, sans-serif" }}>
            Enter your email to get started
          </p>

          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
          />

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-[#1869c2] hover:bg-[#145aa1] text-white font-semibold py-2 px-4 rounded-full transition-all"
          >
            {loading ? "Checking..." : "Login"}
          </button>

          {greeting && (
            <p className="text-green-600 text-sm mt-4" style={{ fontFamily: "Manrope, sans-serif" }}>
              {greeting}
            </p>
          )}
          {error && (
            <p className="text-red-500 text-sm mt-4" style={{ fontFamily: "Manrope, sans-serif" }}>
              {error}
            </p>
          )}

          <div className="mt-6">
            <a
              href="/join"
              className="text-sm text-[#1869c2] hover:underline font-medium"
              style={{ fontFamily: "Manrope, sans-serif" }}
            >
              Join as Member
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

