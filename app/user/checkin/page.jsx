import SignOutButton from "@/components/SignOut";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function CheckinPage() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: records } = await supabase
    .from("attendance")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const { data: absence } = await supabase
    .from("absence")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (!records) {
    return <p>لا يوجد تسجيل حضور</p>;
  }

  console.log(records);
  console.log(absence);
  console.log(profile);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-2">تفاصيل الحضور</h2>
      <p>الاسم: {profile?.full_name}</p>
      <p>الوقت: {new Date(records[0].created_at).toLocaleString()}</p>
      <p>
        الموقع: {records[0].location.latitude}, {records[0].location.longitude}
      </p>
      <SignOutButton />
    </div>
  );
}
