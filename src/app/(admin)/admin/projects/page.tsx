import { DataTable } from "@/components/shared/data-table";
import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";

import { getProjects } from "@/features/projects/actions";
import { getClients } from "@/features/projects/actions/get-clients";

import { columns } from "@/features/projects/columns";
import { CreateProjectDialog } from "@/features/projects/components/create-project-dialog";

export default async function ProjectsPage() {
  const projects = await getProjects();
  const clients = await getClients();

  return (
    <PageContainer>
      <PageHeader
        title="Projects"
        description="Manage all client projects"
        action={
          <CreateProjectDialog
            clients={clients}
          />
        }
      />

      <DataTable
        columns={columns}
        data={projects}
        searchPlaceholder="Search projects..."
      />
    </PageContainer>
  );
}