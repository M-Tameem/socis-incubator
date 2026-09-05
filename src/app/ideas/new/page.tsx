import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { Alert } from "@/components/ui/alert";
import { IdeaForm } from "@/app/ideas/new/idea-form";
import { getProfile } from "@/lib/auth";
import { applicationsOpen, getSettings } from "@/lib/settings";

export const metadata: Metadata = { title: "Post an idea" };

export default async function NewIdeaPage() {
  const [profile, settings] = await Promise.all([getProfile(), getSettings()]);
  if (!profile) redirect("/login?next=/ideas/new");

  if (!applicationsOpen(settings)) {
    return (
      <div className="space-y-8">
        <PageHeader title="The idea portal is closed" />
        <Alert>New ideas closed with applications. Existing posts are still available to read.</Alert>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <PageHeader
        title="Post an idea"
        lede="Give people enough detail to decide whether they want to talk. Keep the first version small."
      />
      <IdeaForm defaultName={profile.full_name ?? undefined} />
    </div>
  );
}
