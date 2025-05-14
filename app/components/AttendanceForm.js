"use client";

import { useState } from "react";
import Link from "next/link";

export default function AttendanceForm() {
  const [name, setName] = useState("");
  const [location, setLocation] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [attendanceTime, setAttendanceTime] = useState(null);
  const [address, setAddress] = useState("");
  const [attendanceType, setAttendanceType] = useState("in");

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("The browser does not support location determination.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();
          setAddress(data.display_name);
        } catch (error) {
          console.error("Error getting address:", error);
          setAddress("Unable to fetch address.");
        }
      },
      (error) => {
        alert("An error occurred while obtaining the location.");
        console.error(error);
      }
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !location) {
      alert("Please enter name and select location.");
      return;
    }

    const now = new Date();
    setAttendanceTime(now);
    setSubmitted(true);

    const newRecord = {
      name,
      type: attendanceType,
      time: now.toISOString(),
      latitude: location.latitude,
      longitude: location.longitude,
      address,
    };

    const existingRecords = JSON.parse(localStorage.getItem("attendanceRecords")) || [];
    existingRecords.push(newRecord);
    localStorage.setItem("attendanceRecords", JSON.stringify(existingRecords));
  };

  const formatTime = (date) => {
    return date.toLocaleString();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 shadow-md rounded w-full max-w-md space-y-4">
        <h2 className="text-2xl font-bold text-center">Attendance registration</h2>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Enter your name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />

            <button
              type="button"
              onClick={handleGetLocation}
              className="w-full bg-gray-200 py-2 rounded hover:bg-gray-300"
            >
              Get Location
            </button>

            {location && (
              <div>
                <div className="w-full h-64 rounded overflow-hidden border">
                  <iframe
                    title="Location Map"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    src={`https://www.google.com/maps?q=${location.latitude},${location.longitude}&z=15&output=embed`}
                  ></iframe>
                </div>
                {address && (
                  <p className="text-sm text-gray-600 mt-2">📍 Address: {address}</p>
                )}
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="attendanceType"
                  value="in"
                  checked={attendanceType === "in"}
                  onChange={() => setAttendanceType("in")}
                />
                <span>⏰ Punch In</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="attendanceType"
                  value="out"
                  checked={attendanceType === "out"}
                  onChange={() => setAttendanceType("out")}
                />
                <span>🔁 Punch Out</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              Attendance registration
            </button>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <p className="text-lg font-semibold text-green-700">
              ✅ {attendanceType === "in" ? "Punch In" : "Punch Out"} has been successfully registered!
            </p>
            <div className="grid grid-cols-1 gap-2">
              <p className="bg-green-100 py-1 rounded">🙍‍♀️ Name: {name}</p>
              <p className="bg-blue-100 py-1 rounded">🕓 Time: {formatTime(attendanceTime)}</p>
              <p className="bg-yellow-100 py-1 rounded">📄 Type: {attendanceType === "in" ? "Punch In" : "Punch Out"}</p>
              {address && (
                <p className="text-sm text-gray-600 bg-gray-100 py-1 rounded">📍 Address: {address}</p>
              )}
            </div>

            {location && (
              <div>
                <div className="w-full h-64 rounded overflow-hidden border">
                  <iframe
                    title="Location Map"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    src={`https://www.google.com/maps?q=${location.latitude},${location.longitude}&z=15&output=embed`}
                  ></iframe>
                </div>
              </div>
            )}

            <Link href="/history">
              <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                📜 View Attendance History
              </button>
            </Link>

            <button
              onClick={() => {
                localStorage.removeItem("loggedIn");
                window.location.href = "/";
              }}
              className="mt-4 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
