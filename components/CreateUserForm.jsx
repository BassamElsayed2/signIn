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
import { toast } from "sonner";
import { useLocale, useTranslations } from "next-intl";

export default function CreateUserForm({ setOpen }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const locale = useLocale();
  const t = useTranslations("createUser");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await createUser(formData);

    if (result.success) {
      toast.success(
        locale === "en"
          ? "User created successfully"
          : "تم إنشاء المستخدم بنجاح"
      );
      router.push(`/${locale}/admin`);
    } else {
      setError(result.error);
      toast.error(
        locale === "en"
          ? `Failed to create user: ${result.error}`
          : `فشل في إنشاء المستخدم: ${result.error}`
      );
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4">
      <div>
        <Label htmlFor="full_name" className="mb-2">
          {t("fullName")}
        </Label>
        <Input name="full_name" required />
      </div>
      <div>
        <Label htmlFor="email" className="mb-2">
          {t("email")}
        </Label>
        <Input name="email" type="email" required />
      </div>
      <div>
        <Label htmlFor="password" className="mb-2">
          {t("password")}
        </Label>
        <Input name="password" type="password" required />
      </div>
      <div>
        <Label htmlFor="role" className="mb-2">
          {t("role")}
        </Label>
        <Select name="role" required>
          <SelectTrigger>
            <SelectValue
              placeholder={locale == "en" ? "Chose role" : "اختر الدور"}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">{t("roles.admin")}</SelectItem>
            <SelectItem value="developer">{t("roles.developer")}</SelectItem>
            <SelectItem value="it">{t("roles.it")}</SelectItem>
            <SelectItem value="other">{t("roles.other")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <div className="flex justify-between items-center">
        <Button
          type="button"
          onClick={() => setOpen(false)}
          disabled={loading}
          variant="ghost"
        >
          {t("cancel")}
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? t("loading") : t("submit")}
        </Button>
      </div>
    </form>
  );
}
