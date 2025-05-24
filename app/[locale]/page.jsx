// مفيش "use client" هنا
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ClientComponent from "@/components/ClientComponent"; // استدعاء الملف اللي أنشأناه

export default async function UserPage() {
  const supabase = createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profile?.role === "admin") redirect("/admin");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data: existingRecords } = await supabase
    .from("attendance")
    .select("*")
    .eq("user_id", user.id)
    .gte("created_at", today.toISOString())
    .limit(1);

  if (existingRecords && existingRecords.length > 0) {
    redirect("/user/checkin");
  }
if (!profile) redirect("/login"); // أو أي مسار مناسب

  return <ClientComponent profile={profile} />;
}
