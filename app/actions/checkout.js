"use server";

import { createClient } from "@/utils/supabase/server";
import { getLocale } from "next-intl/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function logoutAction(attendanceId) {
  const supabase = createClient();
  const logoutTime = new Date().toISOString();
  const locale = await getLocale();

  console.log(locale)

  await supabase
    .from("attendance")
    .update({ logout_time: logoutTime })
    .eq("id", attendanceId);

  revalidatePath(`/${locale}/user/history`);
  redirect(`/${locale}/user/history`);
}