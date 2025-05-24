"use client";

import { useEffect, useState } from "react";
import NavBar from "@/components/NavBar";
import HistoryCalendar from "@/components/HistoryCalendar";
import { createClient } from "@/utils/supabase/client";

export default function HistoryPage() {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.id) setUserId(user.id);
    };
    getUser();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <NavBar />
      <div className="max-w-4xl mx-auto p-6 pt-28">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6">📅 تقويم الحضور</h2>
          {userId ? (
            <HistoryCalendar userId={userId} />
          ) : (
            <p className="text-center">جاري التحميل...</p>
          )}
        </div>
      </div>
    </div>
  );
}
