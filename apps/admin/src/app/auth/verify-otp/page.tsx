"use client";

import { Suspense } from "react";
import { VerifyOtpForm } from "@/components/auth/verify-otp-form";

export default function AdminVerifyOtpPage() {
  return (
    <Suspense fallback={null}>
      <VerifyOtpForm />
    </Suspense>
  );
}
