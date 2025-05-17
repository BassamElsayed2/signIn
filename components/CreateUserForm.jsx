"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUser } from "@/app/actions/createUser";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";

export default function CreateUserForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await createUser(formData);

    if (result.success) {
      router.push("/admin"); // أو أي صفحة للعودة
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4">
      <div>
        <Label htmlFor="full_name">الاسم الكامل</Label>
        <Input name="full_name" required />
      </div>
      <div>
        <Label htmlFor="email">البريد الإلكتروني</Label>
        <Input name="email" type="email" required />
      </div>
      <div>
        <Label htmlFor="password">كلمة المرور</Label>
        <Input name="password" type="password" required />
      </div>
      <div>
        <Label htmlFor="role">الدور</Label>
        <Select name="role" required>
          <SelectTrigger>
            <SelectValue placeholder="اختر الدور" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="developer">Developer</SelectItem>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <Button type="submit" disabled={loading}>
        {loading ? "جاري التسجيل..." : "تسجيل مستخدم"}
      </Button>
    </form>
  );
}
