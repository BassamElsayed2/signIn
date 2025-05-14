"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

// ✅ Here you can put a real test later, but now we will transfer it immediately
    if (email && password) {
          localStorage.setItem("loggedIn", "true");
      router.push("/user"); 
    } else {
      alert("Please fill in all fields");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-md rounded p-8 w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center"> Log In</h2>

        <input
          type="email"
          placeholder="Email "
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />

        <input
          type="password"
          placeholder=" Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Log In
        </button>
      </form>
    </main>
  );
}
