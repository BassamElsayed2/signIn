"use client";

import { useEffect, useState } from "react";
import NavBar from "@/components/NavBar";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { saveAs } from "file-saver";

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
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, address")
        .eq("id", user.id)
        .single();

      setUserInfo(profile);

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
      dates.push(d.toISOString().split("T")[0]);
    }
    return dates;
  };

  const getAttendanceMap = () => {
    const map = new Set(
      attendance.map((r) => new Date(r.timestamp).toISOString().split("T")[0])
    );
    return map;
  };

  const downloadCSV = () => {
    if (!userInfo?.full_name) return;

    let csv = `الاسم,العنوان,التاريخ,الحالة\n`;
    const map = getAttendanceMap();
    dateList.forEach((date) => {
      const status = map.has(date) ? "✅ حضور" : "❌ غياب";
      csv += `${userInfo.full_name},${userInfo.address},${date},${status}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "attendance_report.csv");
  };

  const attendanceMap = getAttendanceMap();
  const attendanceDays = attendanceMap.size;
  const totalDays = dateList.length;
  const absenceDays = totalDays - attendanceDays;
  const attendanceRate = ((attendanceDays / totalDays) * 100).toFixed(1);

  const isDownloadDisabled = loading || !userInfo?.full_name;

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
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">📅 تقويم الحضور</h2>
            <div className="flex flex-col items-end">
              <button
                onClick={downloadCSV}
                disabled={isDownloadDisabled}
                className={`px-3 py-1 rounded ${
                  isDownloadDisabled
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-700 hover:bg-green-600 text-white"
                }`}
              >
                تحميل التقرير
              </button>
              {isDownloadDisabled && (
                <p className="text-xs text-red-600 mt-1">
                  {loading
                    ? "جاري تحميل البيانات..."
                    : "بيانات المستخدم غير مكتملة"}
                </p>
              )}
            </div>
          </div>

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

              {/* التقويم */}
              <div className="grid grid-cols-7 mt-6 rtl gap-2 select-none">
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

                {/* الفراغات */}
                {(() => {
                  const firstDay = new Date(dateList[0]).getDay();
                  const offset = (firstDay + 1) % 7;
                  return Array.from({ length: offset }).map((_, i) => (
                    <div key={`empty-${i}`} />
                  ));
                })()}

                {dateList.map((date) => {
                  const isPresent = attendanceMap.has(date);
                  return (
                    <div
                      key={date}
                      className="flex justify-center items-center py-1"
                    >
                      <div
                        className={`w-8 h-8 rounded-full text-xs font-medium flex items-center justify-center cursor-pointer transition-all ${
                          isPresent
                            ? "bg-green-600 text-white"
                            : "bg-red-500 text-white"
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
