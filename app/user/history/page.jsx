"use client";

import { useEffect, useState } from "react";
import NavBar from "@/components/NavBar";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

const timeOptions = [
  { label: "أسبوع", value: 7 },
  { label: "شهر", value: 30 },
  { label: "آخر 3 شهور", value: 90 },
];

export default function HistoryPage() {
  const [attendance, setAttendance] = useState([]);
  const [duration, setDuration] = useState(7);
  const [loading, setLoading] = useState(true);
  const [dateList, setDateList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const sinceDate = new Date();
      sinceDate.setDate(sinceDate.getDate() - duration);

      const { data: attendanceData } = await supabase
        .from("attendance")
        .select("*")
        .eq("user_id", user.id)
        .gte("timestamp", sinceDate.toISOString());

      setAttendance(attendanceData || []);
      setDateList(generateDateList(duration));
      setLoading(false);
    };

    fetchData();
  }, [duration]);

  const generateDateList = (days) => {
    const dates = [];
    const now = new Date();
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      dates.push(d.toISOString().split("T")[0]); // yyyy-mm-dd
    }
    return dates;
  };

  const getAttendanceMap = () => {
    const map = new Set(
      attendance.map((r) => new Date(r.timestamp).toISOString().split("T")[0])
    );
    return map;
  };

  const attendanceMap = getAttendanceMap();

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <NavBar />

      <div className="max-w-3xl mx-auto p-6 pt-28">
        <Link href="/user">
          <button className="mb-6 px-4 py-2 rounded bg-gray-800 text-white hover:bg-gray-700 transition">
            ← العودة
          </button>
        </Link>
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4 text-center">
          <h2 className="text-2xl font-bold">📊 ملخص الحضور والغياب</h2>

          <div className="flex justify-center gap-4 flex-wrap">
            {timeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setDuration(option.value)}
                className={`px-4 py-2 rounded-full border ${
                  duration === option.value
                    ? "bg-gray-900 text-white"
                    : "bg-white text-gray-700"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {loading ? (
            <p>جاري التحميل...</p>
          ) : (
            <>
              <p className="text-lg font-medium text-gray-700">
                ✅ عدد أيام الحضور: {attendanceMap.size}
              </p>
              <p className="text-lg font-medium text-gray-700">
                ❌ عدد أيام الغياب: {dateList.length - attendanceMap.size}
              </p>

              <div className="text-right mt-6 space-y-2">
                {dateList.map((date) => (
                  <p
                    key={date}
                    className={`text-base ${
                      attendanceMap.has(date)
                        ? "text-green-700"
                        : "text-red-600"
                    }`}
                  >
                    {date} — {attendanceMap.has(date) ? "✅ حضور" : "❌ غياب"}
                  </p>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
