"use client";

import { useState } from "react";

export default function AttendanceForm() {
  const [name, setName] = useState("");
  const [location, setLocation] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [attendanceTime, setAttendanceTime] = useState(null);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("The browser does not support location determination.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
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
            )}

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
              ✅ Attendance has been successfully registered!
            </p>
            <p className="bg-green-100 py-1 rounded">{name}</p>

            {location && (
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
            )}

            {attendanceTime && (
              <p>🕒 Attendance Time: {formatTime(attendanceTime)}</p>
            )}

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
