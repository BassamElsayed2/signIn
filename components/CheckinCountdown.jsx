"use client";
import { useEffect, useState, useRef } from "react";
import { differenceInSeconds, addHours } from "date-fns";
import { useLocale } from "next-intl";

export default function CheckinCountdown({
  role,
  checkInTime,
  attendanceId,
  checkInLocation,
  forceAllowTimer,
}) {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isOutOfRange, setIsOutOfRange] = useState(false);
  const [outDuration, setOutDuration] = useState(0);
  const intervalRef = useRef(null);
  const outIntervalRef = useRef(null);

  const locale = useLocale();

  const workingHours = {
    developer: 5,
    it: 7,
    default: 5,
  };

  const getDeadline = () => {
    const hours = workingHours[role] ?? workingHours.default;
    return addHours(new Date(checkInTime), hours);
  };

  const deadline = getDeadline();

  // نقرأ outDuration من localStorage عند تحميل المكون لأول مرة
  useEffect(() => {
    const savedOutDuration = localStorage.getItem("outDuration");
    if (savedOutDuration) {
      setOutDuration(parseInt(savedOutDuration, 10));
    }
  }, []);

  useEffect(() => {
    // تتبع الموقع
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const maxDistance = 100; // بالمتر

        const distance = getDistanceFromLatLonInMeters(
          latitude,
          longitude,
          checkInLocation.latitude,
          checkInLocation.longitude
        );

        setIsOutOfRange(distance > maxDistance);
      },
      (err) => console.error("Geo error:", err),
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [checkInLocation]);

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      // نضيف مدة الخروج على الوقت النهائي
      const adjustedDeadline = new Date(
        deadline.getTime() + outDuration * 1000
      );
      const secondsLeft = differenceInSeconds(adjustedDeadline, now);
      setTimeLeft(Math.max(0, secondsLeft));
    };

    if (!isOutOfRange || forceAllowTimer) {
      updateTimer(); // أول مرة
      intervalRef.current = setInterval(updateTimer, 1000);

      // لما يرجع جوة النطاق ننظف outDuration من localStorage ومن الحالة
      if (outIntervalRef.current) {
        clearInterval(outIntervalRef.current);
        outIntervalRef.current = null;
      }
      setOutDuration(0);
      localStorage.removeItem("outDuration");
    } else {
      // لو خارج النطاق، نوقف عداد الوقت العادي وندخل في عداد لحساب مدة الخروج
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      if (!outIntervalRef.current) {
        outIntervalRef.current = setInterval(() => {
          setOutDuration((prev) => {
            const newDuration = prev + 1;
            localStorage.setItem("outDuration", newDuration.toString());
            return newDuration;
          });
        }, 1000);
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (outIntervalRef.current) clearInterval(outIntervalRef.current);
    };
  }, [deadline, isOutOfRange, forceAllowTimer]);

  function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // نصف قطر الأرض بالمتر
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) ** 2 +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="mt-6 text-center">
      {isOutOfRange && !forceAllowTimer ? (
        <p className="text-red-600 text-lg font-semibold">
          {locale == "en"
            ? "⚠️ You are now out of range, the counter has been paused."
            : "⚠️ أنت الآن خارج نطاق الموقع، تم إيقاف العداد مؤقتًا."}
        </p>
      ) : (
        <p className="text-2xl font-bold text-gray-900">
          {locale == "en"
            ? `⏳ Time remaining: ${hours}h ${minutes}m ${seconds}s`
            : ` ⏳ الوقت المتبقي: ${hours}س ${minutes}د ${seconds}ث`}
        </p>
      )}
    </div>
  );
}
