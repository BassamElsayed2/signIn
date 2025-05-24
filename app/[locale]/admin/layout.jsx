import { AppSidebar } from "@/components/AppSidebar";
import { SiteHeader } from "@/components/SiteHeader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { supabase } from "@/lib/supabase";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import React from "react";

import { AdminDataProvider } from "@/components/AdminDataContext";

export default async function AdminLayout({ children }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/");

  const { data: users } = await supabase.from("profiles").select("*");
  const { data: attendance } = await supabase.from("attendance").select("*");
  const { data: absence } = await supabase.from("absence").select("*");

  const contextValue = {
    profile,
    users,
    attendance,
    absence,
  };

  return (
    <SidebarProvider>
      <AdminDataProvider value={contextValue}>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader name={profile.full_name} />
          {children}
        </SidebarInset>
      </AdminDataProvider>
    </SidebarProvider>
  );
}
