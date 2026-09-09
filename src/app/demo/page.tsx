import { notFound, redirect } from "next/navigation";
import { demoEnabled, getDemoRole } from "@/lib/demo";

export default async function DemoPage() {
  if (!demoEnabled()) notFound();
  const role = await getDemoRole();
  if (!role) redirect("/login");
  redirect(role === "student" ? "/demo/student" : "/demo/exec");
}
