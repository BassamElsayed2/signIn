// components/AdminDataContext.tsx
"use client";

import React, { createContext, useContext, useState } from "react";

const AdminDataContext = createContext(null);

export function AdminDataProvider({ value, children }) {
  // استخدم useState للاحتفاظ بالمستخدمين وحالتهم للتحديث
  const [users, setUsers] = useState(value.users || []);
  const [attendance, setAttendance] = useState(value.attendance || []);
  const [absence, setAbsence] = useState(value.absence || []);
  const [profile] = useState(value.profile || null);

  const contextValue = {
    profile,
    users,
    setUsers, // ضروري عشان تقدر تحدث قائمة المستخدمين بعد حذف
    attendance,
    setAttendance,
    absence,
    setAbsence,
  };

  return (
    <AdminDataContext.Provider value={contextValue}>
      {children}
    </AdminDataContext.Provider>
  );
}

export function useAdminData() {
  const context = useContext(AdminDataContext);
  if (!context)
    throw new Error("useAdminData must be used inside AdminDataProvider");
  return context;
}
