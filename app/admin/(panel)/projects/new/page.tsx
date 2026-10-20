import type { Metadata } from "next";

import { PageHeader } from "@/components/admin/PageHeader";
import { ProjectForm } from "@/components/admin/ProjectForm";

export const metadata: Metadata = { title: "New project" };

export default function NewProjectPage() {
  return (
    <>
      <PageHeader
        title="New project"
        description="Create the project first, then add photos and videos on the next screen."
      />
      <ProjectForm />
    </>
  );
}
