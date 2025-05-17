import CreateUserForm from "@/components/CreateUserForm";
import SignOutButton from "@/components/SignOut";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // تحقق من أن المستخدم أدمن، مثلاً من خلال رول معين في جدول profiles
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/");

  const { data: users } = await supabase.from("profiles").select("*");

  const { data: attendance } = await supabase.from("attendance").select("*");
  const { data: absence } = await supabase.from("absence").select("*");

  console.log(profile);
  console.log(users);
  console.log(attendance);
  console.log(absence);
  return (
    <div className="p-6">
      <SignOutButton />
      <CreateUserForm />
    </div>
  );
}
