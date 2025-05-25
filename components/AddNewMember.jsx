"use client";

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
import { useLocale } from "next-intl";

export default function AddNewMember() {
  const [open, setOpen] = useState(false);

  const locale = useLocale();

  return (
    <div>
      <Button onClick={() => setOpen(true)}>
        {locale == "en" ? "Add a new employee +" : "اضف موظف جديد +"}
      </Button>
      <Dialog open={open}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {locale == "en" ? "Add a new employee" : "أضف موظف جديد"}
            </DialogTitle>

            <CreateUserForm setOpen={setOpen} />
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
