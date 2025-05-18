"use client";

import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

// دالة لتنسيق التاريخ لليوم فقط
const formatDate = (date) => date.toISOString().split("T")[0];

export default function UserAttendanceChart({ attendance, absence }) {
  const [range, setRange] = useState("week");

  const filterByRange = (records, daysBack) => {
    const today = new Date();
    const start = new Date();
    start.setDate(today.getDate() - daysBack + 1);

    return records.filter((r) => {
      const date = new Date(r.timestamp);
      return date >= start && date <= today;
    });
  };

  const chartData = useMemo(() => {
    let filteredAttendance = [];
    let filteredAbsence = [];

    if (range === "week") {
      filteredAttendance = filterByRange(attendance, 7);
      filteredAbsence = filterByRange(absence, 7);
    } else if (range === "month") {
      const today = new Date();
      const start = new Date(today.getFullYear(), today.getMonth(), 1);
      filteredAttendance = attendance.filter((r) => {
        const d = new Date(r.timestamp);
        return d >= start && d <= today;
      });
      filteredAbsence = absence.filter((r) => {
        const d = new Date(r.timestamp);
        return d >= start && d <= today;
      });
    }

    // استخدام Set لتفادي التكرار في الأيام
    const attendedDays = new Set(
      filteredAttendance.map((r) => formatDate(new Date(r.timestamp)))
    );
    const missedDays = new Set(
      filteredAbsence.map((r) => formatDate(new Date(r.timestamp)))
    );

    const totalDays = new Set([...attendedDays, ...missedDays]).size || 1; // لتفادي القسمة على صفر
    const attended = attendedDays.size;
    const missed = missedDays.size;

    return [
      { name: "الحضور", value: (attended / totalDays) * 100 },
      { name: "الغياب", value: (missed / totalDays) * 100 },
    ];
  }, [attendance, absence, range]);

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <CardTitle>إحصائيات الحضور والغياب</CardTitle>
        <Select value={range} onValueChange={setRange}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="اختر المدى" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">آخر أسبوع</SelectItem>
            <SelectItem value="month">هذا الشهر</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="h-[300px]">
        {chartData.every((item) => item.value === 0) ? (
          <p className="text-center text-gray-500 mt-20">
            لا توجد بيانات لعرضها
          </p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis
                domain={[0, 100]}
                tickFormatter={(v) => `${v.toFixed(0)}%`}
              />
              <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
