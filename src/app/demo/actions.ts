"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DEMO_COOKIE, demoEnabled, type DemoRole } from "@/lib/demo";

export async function enterDemo(formData: FormData) {
  if (!demoEnabled()) redirect("/login");

  const value = String(formData.get("role") ?? "");
  if (value !== "student" && value !== "exec") redirect("/login");

  const role = value as DemoRole;
  (await cookies()).set(DEMO_COOKIE, role, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  redirect(role === "student" ? "/demo/student" : "/demo/exec");
}

export async function leaveDemo() {
  (await cookies()).delete(DEMO_COOKIE);
  redirect("/login");
}
