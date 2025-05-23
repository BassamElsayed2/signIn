"use client";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CreateUserForm from "./CreateUserForm";

export default function AddNewMember() {
  const [open, setOpen] = useState(false);
const t = useTranslations("admin");
  return (
    <div>
      <Button onClick={() => setOpen(true)}>{t("add_new_member_button")}</Button>
      <Dialog open={open}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("add_new_member_title")}</DialogTitle>

            <CreateUserForm setOpen={setOpen} />
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
