"use client";
import {useTranslations} from 'next-intl';
import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import { useAdminData } from "@/components/AdminDataContext";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function SectionCards() {
  const { users, attendance } = useAdminData();
const t = useTranslations("admin");
  // استبعاد الإدمن
  const nonAdminUsers = users.filter((user) => user.role !== "admin");
  const totalUsers = nonAdminUsers.length;

  // التاريخ الحالي
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // صفر-based

  // بنستخدم Set علشان نتجنب التكرار
  const uniqueAttendanceThisMonth = new Set();

  attendance.forEach((record) => {
    const date = new Date(record.timestamp);
    if (
      date.getFullYear() === currentYear &&
      date.getMonth() === currentMonth &&
      nonAdminUsers.some((u) => u.id === record.user_id)
    ) {
      // المفتاح يكون userId + تاريخ اليوم بدون توقيت
      const key = `${
        record.user_id
      }-${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      uniqueAttendanceThisMonth.add(key);
    }
  });

  // عدد الأيام التي مرت من الشهر (بما في ذلك اليوم)
  const daysPassed = now.getDate();

  // إجمالي الفرص المتاحة للحضور = عدد المستخدمين * عدد أيام الشهر حتى الآن
  const totalPossibleAttendances = totalUsers * daysPassed;

  const actualAttendances = uniqueAttendanceThisMonth.size;

  const attendanceRate =
    totalPossibleAttendances > 0
      ? (actualAttendances / totalPossibleAttendances) * 100
      : 0;

  const absenceRate = 100 - attendanceRate;

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 *:data-[slot=card]:shadow-xs *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card">
      {/* إجمالي المستخدمين */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>{t("total_users")}</CardDescription>
          <CardTitle className="text-3xl font-semibold tabular-nums">
            {totalUsers}
          </CardTitle>
        </CardHeader>
        {/* <CardFooter className="text-sm text-muted-foreground">  
          
        </CardFooter> */}
      </Card>

      {/* نسبة الحضور الشهرية */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>{t("total_attendance_month")}</CardDescription>
          <CardTitle className="text-3xl font-semibold tabular-nums">
            {attendanceRate.toFixed(1)}%
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex gap-2 text-sm">
          {attendanceRate >= 75 ? (
            <>
              {t("excellent_performance")}<TrendingUpIcon className="size-4 text-green-500" />
            </>
          ) : (
            <>
              {t("needs_improvement")}{" "}
              <TrendingDownIcon className="size-4 text-yellow-500" />
            </>
          )}
        </CardFooter>
      </Card>

      {/* نسبة الغياب الشهرية */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>{t("total_absence_month")}</CardDescription>
          <CardTitle className="text-3xl font-semibold tabular-nums">
            {absenceRate.toFixed(1)}%
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex gap-2 text-sm">
          {absenceRate >= 50 ? (
            <>
              {t("high_absence")} <TrendingDownIcon className="size-4 text-red-500" />
            </>
          ) : (
            <>
              {t("acceptable_absence")}<TrendingUpIcon className="size-4 text-green-500" />
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
