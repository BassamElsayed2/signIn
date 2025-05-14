"use client";

import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center p-8 bg-gradient-to-br from-blue-50 to-white">
      <h1 className="text-4xl font-bold mb-4 text-blue-700">Welcome!</h1>
      <p className="text-lg mb-8 text-gray-700">Attendance Tracker</p>

      <button
        onClick={() => router.push("/login")}
        className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
      >
        Start Attendance Registration
      </button>
    </main>
  );
}
