"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAdminData } from "@/components/AdminDataContext";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useState } from "react";
import { useTranslations } from "next-intl";

export default function AttendanceBarChart() {
  const { users, attendance } = useAdminData();
  const [range, setRange] = useState("week");
const isMobile = useIsMobile();
  const nonAdminUsers = users.filter((user) => user.role !== "admin");
  const totalUsers = nonAdminUsers.length;
const t = useTranslations("admin");

  const getDatesBetween = (start, end) => {
    const dates = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d));
    }
    return dates;
  };

  const formatDate = (date) => {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  };

  const getRangeDates = () => {
    const end = new Date();
    if (range === "week") {
      const start = new Date();
      start.setDate(end.getDate() - 6);
      return { start, end };
    }
    if (range === "month") {
      const start = new Date(end.getFullYear(), end.getMonth(), 1);
      return { start, end };
    }
    if (range === "3months") {
      const start = new Date(end.getFullYear(), end.getMonth() - 2, 1);
      return { start, end };
    }
  };

  const generateChartData = () => {
    const { start, end } = getRangeDates();
    const dates = getDatesBetween(new Date(start), new Date(end));
    const data = [];

    for (const date of dates) {
      const unique = new Set();
      attendance.forEach((record) => {
        const recDate = new Date(record.timestamp);
        if (
          recDate.getFullYear() === date.getFullYear() &&
          recDate.getMonth() === date.getMonth() &&
          recDate.getDate() === date.getDate() &&
          nonAdminUsers.some((u) => u.id === record.user_id)
        ) {
          const key = `${
            record.user_id
          }-${recDate.getFullYear()}-${recDate.getMonth()}-${recDate.getDate()}`;
          unique.add(key);
        }
      });

      const totalPossible = totalUsers;
      const actual = unique.size;
      const attendanceRate =
        totalPossible > 0 ? (actual / totalPossible) * 100 : 0;
      const absenceRate = 100 - attendanceRate;

      data.push({
        name: formatDate(date),
        الحضور: Number(attendanceRate.toFixed(1)),
        الغياب: Number(absenceRate.toFixed(1)),
      });
    }

    return data;
  };

  const chartData = generateChartData();

  return (
    <div className="mx-auto p-0">
      <Card >
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>{t("attendance_chart_title")}</CardTitle>
          </div>
          <Select value={range} onValueChange={setRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t("select_range_placeholder")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">{t("range_week")}</SelectItem>
              <SelectItem value="month">{t("range_month")}</SelectItem>
              <SelectItem value="3months">{t("range_3months")}</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>

        <CardContent className="h-[360px] mr-4 p-0 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%" >
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
             {!isMobile && <XAxis dataKey="name" /> } 
             {!isMobile &&  <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />}
              <Tooltip formatter={(value) => `${value}%`} />
              <Legend />
              <Bar name={t("attendance")} dataKey="الحضور" fill="#000" radius={[4, 4, 0, 0]} />
              <Bar name={t("absence")} dataKey="الغياب" fill="#6c757d" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
