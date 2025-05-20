"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function logoutAction(attendanceId) {
  const supabase = createClient();
  const logoutTime = new Date().toISOString();

  await supabase
    .from("attendance")
    .update({ logout_time: logoutTime })
    .eq("id", attendanceId);

  revalidatePath("/user/history");
  redirect("/user/history");
}
