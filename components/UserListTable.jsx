"use client";

import React, { useMemo, useState, useCallback, useEffect } from "react";
import { useAdminData } from "./AdminDataContext";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import { useIsMobile } from "@/hooks/use-mobile";
import {useTranslations} from 'next-intl';
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

  const t = useTranslations("admin.user_detail.table");
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

      alert(t("delete_success"));
    } catch (error) {
      alert(t("delete_error") +(error.message || error));
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
    const userEntriesToday = attendance.filter(
      (entry) =>
        entry.user_id === user.id && entry.timestamp?.split("T")[0] === today
    );

    const hasLoggedOutToday = userEntriesToday.some(
      (entry) => entry.logout_time?.split("T")[0] === today
    );

    let حالة_بصرية;
    if (hasLoggedOutToday) {
      حالة_بصرية = t("status_logged_out");
    } else if (userEntriesToday.length > 0) {
      حالة_بصرية = t("status_present");
    } else {
      حالة_بصرية = t("status_absent");
    }

    return {
      id: user.id,
      "#": index + 1,
      الاسم: user.full_name,
      الدور: user.role,
      حالة_بصرية,
      hasLoggedOutToday,
      isPresent: userEntriesToday.length > 0,
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
          title={t("view_details")}
        >
          <Eye className="w-4 h-4" />
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => handleOpenDeleteDialog(user)}
          title={t("delete_user")}
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
      { headerName: t("name"), field: "الاسم", flex: 2 },
      !isMobile && { headerName: t("role"), field: "الدور", flex: 1 },
      {
        headerName: t("status_title"),
        field: "حالة_بصرية",
        flex: 1,
        cellRenderer: (params) => {
          const { isPresent, hasLoggedOutToday } = params.data;
          return (
            <span className="flex items-center mt-2 justify-center gap-2">
              <span
                className={`w-3 h-3 rounded-full ${
                  hasLoggedOutToday
                    ? "bg-blue-500"
                    : isPresent
                    ? "bg-green-500"
                    : "bg-gray-800"
                }`}
              />
              <span className="hidden md:block">{params.value}</span>
            </span>
          );
        },
      },
      {
        headerName: t("actions_title"),
        field: "actions",
        flex: 2,
        cellRenderer: ActionCellRenderer,
        sortable: false,
        filter: false,
      },
    ].filter(Boolean),
  [isMobile, handleShowDetails, handleOpenDeleteDialog, t]
);


  return (
    <>
      <div style={{ width: "100%", height: "100%" }} className=" my-8">
        <div className="p-2 rounded-lg border shadow-sm flex gap-2 mb-4 max-w-sm">
          <Search />
          <input
            type="text"
            placeholder={t("search_placeholder")}
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
            <DialogTitle>{t("delete_confirmation_title")}</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <p> {t("delete_confirmation_message")} {selectedUser.full_name}؟</p>
          )}
          <DialogFooter className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
             {t("cancel")}
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
             {t("delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
