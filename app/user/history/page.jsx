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
  const [duration, setDuration] = useState(30);
  const [loading, setLoading] = useState(true);
  const [dateList, setDateList] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

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
  const attendanceDays = attendanceMap.size;
  const totalDays = dateList.length;
  const absenceDays = totalDays - attendanceDays;
  const attendanceRate = ((attendanceDays / totalDays) * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <NavBar />

      <div className="max-w-4xl mx-auto p-6 pt-28">
        <Link href="/user">
          <button className="mb-6 px-4 py-2 rounded bg-gray-800 text-white hover:bg-gray-700 transition">
            ← العودة
          </button>
        </Link>

        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-8">
          <h2 className="text-2xl font-bold text-center">📅 تقويم الحضور</h2>

          {/* اختيار المدة */}
          <div className="flex justify-center gap-4 flex-wrap">
            {timeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setDuration(option.value)}
                className={`px-4 py-2 rounded-full border transition ${
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
            <p className="text-center">جاري التحميل...</p>
          ) : (
            <>
              {/* التفاصيل - صف أفقي، متناغم، مع حدود و ظل ناعم */}
              <div className="flex justify-around bg-gray-50 p-4 rounded-xl shadow-inner text-gray-800 font-semibold text-center rtl">
                <div className="flex flex-col items-center">
                  <span className="text-green-600 text-xl">✅</span>
                  <span>عدد أيام الحضور</span>
                  <span className="text-lg">{attendanceDays}</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-red-600 text-xl">❌</span>
                  <span>عدد أيام الغياب</span>
                  <span className="text-lg">{absenceDays}</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-blue-600 text-xl">📈</span>
                  <span>نسبة الحضور</span>
                  <span className="text-lg">{attendanceRate}%</span>
                </div>
              </div>

              {/* التقويم - أصغر وأوضح */}
<div className="grid grid-cols-7 mt-6 rtl select-none">
  {/* عنوان أيام الأسبوع */}
  {[
    "السبت",
    "الأحد",
    "الاثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
  ].map((day) => (
    <div
      key={day}
      className="font-semibold text-xs text-center text-gray-700 border-b pb-1 h-6 flex items-center justify-center"
    >
      {day}
    </div>
  ))}

  {/* حساب الفراغات قبل أول يوم */}
  {(() => {
    const firstDay = new Date(dateList[0]).getDay(); // 0: أحد -> 6: سبت
    const offset = (firstDay + 1) % 7; // نضبطه بحيث يبدأ من السبت
    return Array.from({ length: offset }).map((_, i) => (
      <div key={`empty-${i}`} />
    ));
  })()}

  {/* الأيام */}
  {dateList.map((date) => {
    const isPresent = attendanceMap.has(date);
    return (
      <div
        key={date}
        className="flex justify-center items-center py-1"
      >
        <div
          className={`w-7 h-7 rounded-full text-xs font-medium flex items-center justify-center cursor-pointer transition-all ${
            isPresent
              ? "bg-green-600 text-white shadow"
              : "bg-red-500 text-white shadow-sm"
          }`}
          title={date}
          onClick={() => setSelectedDate(date)}
        >
          {new Date(date).getDate()}
        </div>
      </div>
    );
  })}
</div>


              {/* المفتاح */}
              <div className="flex justify-center gap-8 mt-4 text-sm rtl">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-green-600 shadow"></span> حضور
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-red-500 shadow"></span> غياب
                </div>
              </div>

              {/* تفاصيل اليوم */}
              {selectedDate && (
                <div className="text-center mt-6">
                  <p className="font-bold text-lg">
                    {selectedDate} —{" "}
                    {attendanceMap.has(selectedDate) ? "✅ حضور" : "❌ غياب"}
                  </p>
                  <button
                    onClick={() => setSelectedDate(null)}
                    className="mt-2 text-sm text-gray-500 underline"
                  >
                    إغلاق
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
