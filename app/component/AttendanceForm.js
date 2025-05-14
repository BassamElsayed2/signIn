"use client";

import { useState } from "react";

export default function AttendanceForm() {
  const [location, setLocation] = useState(null);
  const [attendanceTime, setAttendanceTime] = useState(null);
  const [error, setError] = useState("");

  const handleAttendance = () => {
    if (!navigator.geolocation) {
      setError("المتصفح لا يدعم تحديد الموقع");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
        setAttendanceTime(new Date().toLocaleString());
        setError("");
      },
      () => {
        setError("حدث خطأ أثناء محاولة جلب الموقع");
      }
    );
  };

  return (
    <div className="max-w-md w-full text-center">
      <h2 className="text-2xl font-semibold mb-4">تسجيل الحضور</h2>
      <button
        onClick={handleAttendance}
        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
      >
        تسجيل الحضور
      </button>

      {attendanceTime && (
        <div className="mt-4 text-green-700">
          <p>تم تسجيل الحضور في: {attendanceTime}</p>
          <p>
            الموقع: {location.latitude}, {location.longitude}
          </p>
        </div>
      )}

      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  );
}
