"use client";
import { useEffect, useState, useRef } from "react";
import { differenceInSeconds, addHours } from "date-fns";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("Checkin");

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

  useEffect(() => {
    const savedOutDuration = localStorage.getItem("outDuration");
    if (savedOutDuration) {
      setOutDuration(parseInt(savedOutDuration, 10));
    }
  }, []);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const maxDistance = 100;

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
      const adjustedDeadline = new Date(deadline.getTime() + outDuration * 1000);
      const secondsLeft = differenceInSeconds(adjustedDeadline, now);
      setTimeLeft(Math.max(0, secondsLeft));
    };

    if (!isOutOfRange || forceAllowTimer) {
      updateTimer();
      intervalRef.current = setInterval(updateTimer, 1000);

      if (outIntervalRef.current) {
        clearInterval(outIntervalRef.current);
        outIntervalRef.current = null;
      }
      setOutDuration(0);
      localStorage.removeItem("outDuration");
    } else {
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
    const R = 6371e3;
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
          ⚠️ {t("outOfRange")}
        </p>
      ) : (
        <p className="text-2xl font-bold text-gray-900">
          ⏳ {t("timeLeft", { hours, minutes, seconds })}
        </p>
      )}
    </div>
  );
}
