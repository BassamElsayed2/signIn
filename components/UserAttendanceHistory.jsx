"use client";

import { useMemo, useState } from "react";
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

export default function UserAttendanceHistory({
  attendance = [],
  absence = [],
}) {
  const [range, setRange] = useState("week");

  const records = useMemo(() => {
    const today = new Date();
    let start;

    if (range === "week") {
      start = new Date();
      start.setDate(today.getDate() - 6);
    } else {
      start = new Date(today.getFullYear(), today.getMonth(), 1);
    }

    const daysMap = new Map();

    // نحط الحضور
    attendance.forEach((r) => {
      const date = new Date(r.timestamp);
      const key = formatDate(date);
      if (date >= start && date <= today) {
        daysMap.set(key, "حضور");
      }
    });

    // نحط الغياب (فقط لو مفيش حضور في نفس اليوم)
    absence.forEach((r) => {
      const date = new Date(r.timestamp);
      const key = formatDate(date);
      if (date >= start && date <= today && !daysMap.has(key)) {
        daysMap.set(key, "غياب");
      }
    });

    // نرجعهم كمصفوفة مرتبة
    return Array.from(daysMap.entries())
      .map(([date, status]) => ({ date, status }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [attendance, absence, range]);

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <CardTitle>تاريخ الحضور والغياب</CardTitle>
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

      <CardContent>
        {records.length === 0 ? (
          <p className="text-center text-gray-500 mt-8">لا توجد بيانات</p>
        ) : (
          <table className="w-full text-right border mt-2 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">التاريخ</th>
                <th className="border p-2">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {records.map(({ date, status }) => (
                <tr key={date}>
                  <td className="border p-2">{date}</td>
                  <td className="border p-2">{status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  );
}
