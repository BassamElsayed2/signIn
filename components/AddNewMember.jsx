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

export default function AddNewMember() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setOpen(true)}>اضف موظف جديد +</Button>
      <Dialog open={open}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>أضف موظف جديد</DialogTitle>

            <CreateUserForm setOpen={setOpen} />
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
