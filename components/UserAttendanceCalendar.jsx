"use client";

import { useMemo, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// تنسيق التاريخ
const formatDate = (date) =>
  `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;

export default function UserAttendanceCalendar({ attendance = [] }) {
  const [month, setMonth] = useState(new Date());

  // تحويل التواريخ إلى خريطة منسقة بالساعات
  const attendanceMap = useMemo(() => {
    const map = new Map();
    attendance.forEach((r) => {
      const date = new Date(r.timestamp);
      const dateStr = formatDate(date);
      const time = date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      map.set(dateStr, time);
    });
    return map;
  }, [attendance]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>تقويم الحضور</CardTitle>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          month={month}
          onMonthChange={setMonth}
          className="rounded-md border"
          modifiers={{
            attended: (date) => attendanceMap.has(formatDate(date)),
          }}
          modifiersClassNames={{
            attended: "bg-green-500 text-white font-bold rounded-full",
          }}
          selected={undefined}
          onSelect={() => {}}
          components={{
            Day: ({ date, modifiers, className, ...props }) => {
              const dateStr = formatDate(date);
              const time = attendanceMap.get(dateStr);
              const isAttended = !!time;

              const baseDay = (
                <div
                  className={`w-8 h-8 flex items-center justify-center rounded-full transition-all ${
                    isAttended
                      ? "bg-green-500 text-white font-semibold"
                      : "hover:bg-muted"
                  }`}
                >
                  {date.getDate()}
                </div>
              );

              return isAttended ? (
                <Tooltip>
                  <TooltipTrigger asChild>{baseDay}</TooltipTrigger>
                  <TooltipContent side="top">حضر الساعة {time}</TooltipContent>
                </Tooltip>
              ) : (
                baseDay
              );
            },
          }}
        />
      </CardContent>
    </Card>
  );
}
