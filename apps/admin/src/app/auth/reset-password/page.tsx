"use client";

import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export default function AdminResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
