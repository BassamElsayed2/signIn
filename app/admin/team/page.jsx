import AddNewMember from "@/components/AddNewMember";
import UserListTable from "@/components/UserListTable";
import React from "react";

function page() {
  return (
    <div className="p-7">
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-2xl">فريق العمل</h2>
        <AddNewMember />
      </div>
      <UserListTable />
    </div>
  );
}

export default page;
