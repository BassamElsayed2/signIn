"use client";

import { useEffect, useState } from "react";

export default function HistoryPage() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("attendanceRecords")) || [];
    setRecords(stored);
  }, []);

  // تجميع البيانات حسب التاريخ
  const groupedRecords = records.reduce((acc, curr) => {
    const date = curr.time.slice(0, 10);
    if (!acc[date]) acc[date] = {};
    acc[date][curr.type] = curr;
    return acc;
  }, {});

  const daysInMonth = new Date().getDate();
  const attendanceCount = Object.keys(groupedRecords).length;
  const absenceCount = daysInMonth - attendanceCount;
  const attendanceRate = ((attendanceCount / daysInMonth) * 100).toFixed(1);

  const exportToCSV = () => {
    const header = "Name,Type,Date,Time,Latitude,Longitude\n";
    const rows = records.map((r) => {
      const date = new Date(r.time);
      return `${r.name},${r.type},${date.toLocaleDateString()},${date.toLocaleTimeString()},${r.latitude},${r.longitude}`;
    });
    const csvContent = header + rows.join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "attendance_history.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const calculateHours = (inTime, outTime) => {
    const inDate = new Date(inTime);
    const outDate = new Date(outTime);
    const diffMs = outDate - inDate;
    const hours = Math.floor(diffMs / 1000 / 60 / 60);
    const minutes = Math.floor((diffMs / 1000 / 60) % 60);
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded p-4 space-y-4">
        <button
          onClick={() => window.history.back()}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          🔙 Back
        </button>

        <h2 className="text-2xl font-bold text-center mb-4">🕓 Attendance History</h2>

        <div className="text-center text-sm text-gray-700">
          ✅ <strong>{attendanceCount}</strong> days present |
          ❌ <strong>{absenceCount}</strong> days absent |
          📊 <strong>{attendanceRate}%</strong> attendance
        </div>

        <button
          onClick={exportToCSV}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          ⬇️ Export to CSV
        </button>

        <div className="space-y-4 mt-4">
          {Object.entries(groupedRecords).map(([date, dayRecord], idx) => {
            const inData = dayRecord["in"];
            const outData = dayRecord["out"];
            const inTime = inData ? new Date(inData.time).toLocaleTimeString() : "--";
            const outTime = outData ? new Date(outData.time).toLocaleTimeString() : "--";
            const totalHours = inData && outData ? calculateHours(inData.time, outData.time) : "--:--";

            return (
              <div
                key={idx}
                className="bg-gray-50 p-4 rounded border shadow-sm flex flex-col md:flex-row md:items-center md:justify-between"
              >
                <div className="text-left md:text-center">
                  <p className="font-semibold text-lg">📅 {date}</p>
                </div>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2 mt-2 md:mt-0">
                  <div className="text-sm text-gray-700">
                    <strong>⏰ Punch In:</strong> {inTime}
                  </div>
                  <div className="text-sm text-gray-700">
                    <strong>🔁 Punch Out:</strong> {outTime}
                  </div>
                  <div className="text-sm text-gray-700">
                    <strong>⏳ Total Hours:</strong> {totalHours}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
