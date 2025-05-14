"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AttendanceForm from "../components/AttendanceForm";

export default function UserPage() {
  const router = useRouter();

  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedIn");
    if (loggedIn !== "true") {
      router.push("/login");
    }
  }, []);

  return (
    <main className="min-h-screen p-6">
      <AttendanceForm />
    </main>
  );
}
