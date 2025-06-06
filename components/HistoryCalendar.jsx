"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

const timeOptionsKeys = [
  { key: "week", value: 7 },
  { key: "month", value: 30 },
  { key: "last3months", value: 90 },
];

export default function HistoryCalendar({ userId }) {
  const t = useTranslations("calender");
  const [attendance, setAttendance] = useState([]);
  const [duration, setDuration] = useState(30);
  const [loading, setLoading] = useState(true);
  const [dateList, setDateList] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [outOfDuration, setOutOfDuration] = useState(0);

  useEffect(() => {
    const storedOutDuration = localStorage.getItem("outofduration");
    if (storedOutDuration) {
      const seconds = parseInt(storedOutDuration, 10);
      if (!isNaN(seconds)) setOutOfDuration(seconds);
    }
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      setLoading(true);
      const supabase = (await import("@/utils/supabase/client")).createClient();

      const sinceDate = new Date();
      sinceDate.setDate(sinceDate.getDate() - duration);

      const { data: attendanceData } = await supabase
        .from("attendance")
        .select("*")
        .eq("user_id", userId)
        .gte("timestamp", sinceDate.toISOString());

      setAttendance(attendanceData || []);
      setDateList(generateDateList(duration));
      setLoading(false);
    };

    fetchData();
  }, [duration, userId]);

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

  const groupByDate = () => {
    const map = new Map();
    attendance.forEach((r) => {
      const date = new Date(r.timestamp).toISOString().split("T")[0];
      map.set(date, r);
    });
    return map;
  };

  const attendanceMap = groupByDate();
  const attendanceDays = attendanceMap.size;
  const totalDays = dateList.length;
  const absenceDays = totalDays - attendanceDays;
  const attendanceRate = ((attendanceDays / totalDays) * 100).toFixed(1);

  const totalWorkSeconds = attendance.reduce((acc, rec) => {
    if (rec.timestamp && rec.logout_time) {
      const start = new Date(rec.timestamp);
      const end = new Date(rec.logout_time);
      const diffSeconds = (end - start) / 1000;
      if (diffSeconds > 0) return acc + diffSeconds;
    }
    return acc;
  }, 0);

  const adjustedWorkSeconds = Math.max(totalWorkSeconds - outOfDuration, 0);

  const formatTotalDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours} ${t("h")} ${minutes} ${t("m")}`;
  };

  const formatTime = (iso) => {
    if (!iso) return "—";
    const date = new Date(iso);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const calculateDuration = (checkIn, logout) => {
    if (!checkIn || !logout) return "—";
    const start = new Date(checkIn);
    const end = new Date(logout);
    const diff = Math.floor((end - start) / 1000);
    const hours = Math.floor(diff / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    return `${hours} ${t("h")} ${minutes} ${t("m")}`;
  };

  return (
    <div className="space-y-8">
      {/* اختيار المدة */}
      <div className="flex justify-center gap-4 flex-wrap">
        {timeOptionsKeys.map((option) => (
          <button
            key={option.value}
            onClick={() => setDuration(option.value)}
            className={`px-4 py-2 rounded-full border transition ${
              duration === option.value
                ? "bg-gray-900 text-white"
                : "bg-white text-gray-700"
            }`}
          >
            {t(option.key)}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-center">{t("loading")}</p>
      ) : (
        <>
          {/* الإحصائيات */}
          <div className="flex justify-around bg-gray-50 p-4 rounded-xl shadow-inner text-gray-800 font-semibold text-center rtl">
            <div className="flex flex-col items-center">
              <span className="text-green-600 text-xl">✅</span>
              <span>{t("attendanceDays")}</span>
              <span className="text-lg">{attendanceDays}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-red-600 text-xl">❌</span>
              <span>{t("absenceDays")}</span>
              <span className="text-lg">{absenceDays}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-blue-600 text-xl">📈</span>
              <span>{t("attendanceRate")}</span>
              <span className="text-lg">{attendanceRate}%</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-purple-600 text-xl">⏳</span>
              <span>{t("totalWorkHours")}</span>
              <span className="text-lg">
                {formatTotalDuration(adjustedWorkSeconds)}
              </span>
            </div>
          </div>

          {/* التقويم */}
          <div className="grid grid-cols-7 mt-6 rtl gap-2 select-none">
            {[
              "saturday",
              "sunday",
              "monday",
              "tuesday",
              "wednesday",
              "thursday",
              "friday",
            ].map((day) => (
              <div
                key={day}
                className="font-semibold text-xs text-center text-gray-700 border-b pb-1 h-6 flex items-center justify-center"
              >
                {t(day)}
              </div>
            ))}

            {(() => {
              const firstDay = new Date(dateList[0]).getDay();
              const offset = (firstDay + 1) % 7;
              return Array.from({ length: offset }).map((_, i) => (
                <div key={`empty-${i}-${duration}`} />
              ));
            })()}

            {dateList.map((date, i) => {
              const record = attendanceMap.get(date);
              const isPresent = Boolean(record);
              return (
                <div
                  key={`${date}-${i}`}
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
              <span className="w-4 h-4 rounded-full bg-green-600 shadow"></span>{" "}
              {t("present")}
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-red-500 shadow"></span>{" "}
              {t("absent")}
            </div>
          </div>

          {/* تفاصيل اليوم */}
          {selectedDate && (
            <div className="text-center mt-6 bg-gray-50 p-4 rounded-xl">
              <h3 className="text-lg font-bold mb-2">
                {selectedDate} —{" "}
                {attendanceMap.has(selectedDate)
                  ? `✅ ${t("present")}`
                  : `❌ ${t("absent")}`}
              </h3>

              {attendanceMap.has(selectedDate) && (
                <>
                  <p>
                    🕒 {t("checkIn")}:{" "}
                    {formatTime(attendanceMap.get(selectedDate).timestamp)}
                  </p>
                  <p>
                    🚪 {t("checkOut")}:{" "}
                    {formatTime(attendanceMap.get(selectedDate).logout_time)}
                  </p>
                  <p>
                    ⏳ {t("duration")}:{" "}
                    {calculateDuration(
                      attendanceMap.get(selectedDate).timestamp,
                      attendanceMap.get(selectedDate).logout_time
                    )}
                  </p>
                </>
              )}

              <button
                onClick={() => setSelectedDate(null)}
                className="mt-4 text-sm text-gray-500 underline"
              >
                {t("close")}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
