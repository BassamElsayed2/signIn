"use client";

import React, { useMemo, useState, useCallback, useEffect } from "react";
import { useAdminData } from "./AdminDataContext";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import { useIsMobile } from "@/hooks/use-mobile";

ModuleRegistry.registerModules([AllCommunityModule]);

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Trash2, Eye, Search } from "lucide-react";

import { deleteUserById } from "@/lib/deleteUserById";
import { useRouter } from "next/navigation";

export default function UserListTable() {
  const { users, attendance, setUsers, setAttendance, fetchAdminData } =
    useAdminData();
  // fetchAdminData: دالة داخل السياق تعيد تحميل البيانات (users, attendance)

  const today = new Date().toISOString().split("T")[0];
  const isMobile = useIsMobile();
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const router = useRouter();

  const filteredUsers = users.filter((user) => user.role !== "admin");

  const handleOpenDeleteDialog = useCallback((user) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;

    try {
      await deleteUserById(selectedUser.id);

      setUsers((prev) => prev.filter((u) => u.id !== selectedUser.id));

      setIsDeleteDialogOpen(false);
      setSelectedUser(null);

      alert("تم حذف المستخدم بنجاح");
    } catch (error) {
      alert("حدث خطأ أثناء الحذف: " + (error.message || error));
    }
  };

  const handleShowDetails = useCallback(
    (user) => {
      router.push(`/admin/user/${user.id}`);
    },
    [router]
  );

  // هنا: تحديث البيانات بشكل دوري كل 30 ثانية
  useEffect(() => {
    if (!fetchAdminData) return;

    fetchAdminData(); // تحميل أولي

    const interval = setInterval(() => {
      fetchAdminData();
    }, 30000); // 30 ثانية

    return () => clearInterval(interval);
  }, [fetchAdminData]);

  const rowData = filteredUsers.map((user, index) => {
    const attendedToday = attendance.some(
      (entry) =>
        entry.user_id === user.id && entry.timestamp?.split("T")[0] === today
    );

    return {
      id: user.id,
      "#": index + 1,
      الاسم: user.full_name,
      الدور: user.role,
      حالة_بصرية: attendedToday ? "حضر" : "لم يحضر بعد",
      _fullUser: user,
    };
  });

  const ActionCellRenderer = (props) => {
    const user = props.data._fullUser;
    return (
      <div className="flex gap-2 justify-center">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleShowDetails(user)}
          title="عرض التفاصيل"
        >
          <Eye className="w-4 h-4" />
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => handleOpenDeleteDialog(user)}
          title="حذف المستخدم"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    );
  };
  const colDefs = useMemo(
    () =>
      [
        { field: "#", width: 40 },
        { field: "الاسم", flex: 2},
        !isMobile && { field: "الدور", flex: 1 },
        {
          headerName: "الحالة",
          field: "حالة_بصرية",
          flex: 1,
          cellRenderer: (params) => {
            const isPresent = params.value === "حضر";
            return (
              <span className="flex items-center mt-2 justify-center gap-2">
                <span
                  className={`w-3 h-3 rounded-full ${
                    isPresent ? "bg-green-500" : "bg-gray-800"
                  }`}
                />
                <span className="hidden md:block">{params.value}</span>
              </span>
            );
          },
        },
        {
          headerName: "الإجراءات",
          field: "actions",
         flex:2,
          cellRenderer: ActionCellRenderer,
          sortable: false,
          filter: false,
        },
      ].filter(Boolean),
    [isMobile, handleShowDetails, handleOpenDeleteDialog]
  );

  return (
    <>
      <div style={{ width: "100%", height: "100%" }} className=" my-8">
        <div className="p-2 rounded-lg border shadow-sm flex gap-2 mb-4 max-w-sm">
          <Search />
          <input
            type="text"
            placeholder="ابحث عن مستخدم"
            className="outline-none w-full"
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        <AgGridReact
          rowData={rowData}
          columnDefs={colDefs}
          domLayout="autoHeight"
          defaultColDef={{ sortable: true, filter: false }}
          pagination={isMobile ? false : true}
          quickFilterText={searchInput}
          
        />
      </div>

      {/* بوب أب تأكيد الحذف */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تأكيد الحذف</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <p>هل أنت متأكد أنك تريد حذف المستخدم: {selectedUser.full_name}؟</p>
          )}
          <DialogFooter className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              إلغاء
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              حذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
