"use client";

import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  return (
    <section className="relative min-h-[100vh] bg-gradient-to-br from-white via-blue-50 to-red-50 rounded-3xl flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-12 gap-8 shadow-sm">
      <div className="max-w-xl text-center md:text-left space-y-6">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">Welcome!</h1>
        <p className="text-lg text-gray-600">Attendance Tracker</p>

        <Link
          href="/login"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-full font-medium shadow-md hover:bg-blue-700 transition"
        >
          Start Attendance
        </Link>
      </div>

      <Image
        src="/images/d91d3481289abb8511ec5b64429ef165-removebg-preview.png"
        alt="Hero"
        width={400}
        height={400}
        className="rounded-2xl shadow-lg"
      />
    </section>
  );
}
