"use client";

import NavBar from "@/components/NavBar";
import { useState, useEffect } from "react";

export default function HistoryPage() {
  const [records, setRecords] = useState([]);

  const groupedRecords = records.reduce((acc, curr) => {
    const date = curr.time.slice(0, 10);
    if (!acc[date]) acc[date] = {};
    acc[date][curr.type] = curr;
    return acc;
  }, {});

  const daysInMonth = new Date().getDate();
  const attendanceCount = Object.keys(groupedRecords).length;
  const absenceCount = daysInMonth - attendanceCount;
  const attendanceRate =
    attendanceCount === 0
      ? 0
      : ((attendanceCount / daysInMonth) * 100).toFixed(1);

  const calculateHours = (inTime, outTime) => {
    const inDate = new Date(inTime);
    const outDate = new Date(outTime);
    const diffMs = outDate - inDate;
    const hours = Math.floor(diffMs / 1000 / 60 / 60);
    const minutes = Math.floor((diffMs / 1000 / 60) % 60);
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-200 to-gray-400 text-gray-900">
      <NavBar />

      <div className="max-w-4xl mx-auto p-8 pt-28">
        <div className="bg-white rounded-3xl shadow-xl p-8 text-center space-y-6">
          <h2 className="text-3xl font-bold text-gray-900">🕓 سجل الحضور</h2>

          <div className="text-md text-gray-700 font-medium">
            ✅ <strong>{attendanceCount}</strong> يوم حضور |{" "}
            ❌ <strong>{absenceCount}</strong> يوم غياب |{" "}
            📊 <strong>{attendanceRate}%</strong> نسبة الحضور
          </div>

          <button
            disabled
            className="bg-gray-500 text-white px-6 py-2 rounded-xl cursor-not-allowed opacity-60"
            title="خاصية التصدير ستُفعل عند إضافة البيانات"
          >
            ⬇️ تصدير CSV
          </button>

          <div className="space-y-4">
            {Object.keys(groupedRecords).length === 0 ? (
              <p className="text-gray-500 text-lg py-10">لا توجد سجلات حالياً.</p>
            ) : (
              Object.entries(groupedRecords).map(([date, dayRecord], idx) => {
                const inData = dayRecord["in"];
                const outData = dayRecord["out"];
                const inTime = inData
                  ? new Date(inData.time).toLocaleTimeString("ar-EG")
                  : "--";
                const outTime = outData
                  ? new Date(outData.time).toLocaleTimeString("ar-EG")
                  : "--";
                const totalHours =
                  inData && outData
                    ? calculateHours(inData.time, outData.time)
                    : "--:--";

                return (
                  <div
                    key={idx}
                    className="bg-gray-100 border border-gray-300 rounded-xl shadow-sm p-4 flex flex-col md:flex-row md:items-center md:justify-between"
                  >
                    <p className="font-semibold text-lg flex-1">📅 {date}</p>
                    <div className="flex flex-col md:flex-row gap-4 flex-1 text-sm justify-around">
                      <div>
                        <strong>⏰ دخول:</strong> {inTime}
                      </div>
                      <div>
                        <strong>🔁 خروج:</strong> {outTime}
                      </div>
                      <div>
                        <strong>⏳ الساعات:</strong> {totalHours}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
