import { notFound } from "next/navigation";

import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";

import { getPortfolioProject } from "@/features/portfolio/actions/get-portfolio-project";
import { PortfolioForm } from "@/features/portfolio/components/portfolio-form";
import { DeletePortfolioButton } from "@/features/portfolio/components/delete-portfolio-button";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PortfolioProjectPage({
  params,
}: PageProps) {
  const { id } = await params;

  const project =
    await getPortfolioProject(
      id
    );

  if (!project) {
    notFound();
  }

  return (
    <PageContainer>
      <PageHeader
        title={
          project.title
        }
        description="Edit portfolio project"
        action={
          <DeletePortfolioButton
            projectId={
              project.id
            }
          />
        }
      />

      <SectionCard title="Project Information">
        <PortfolioForm
          project={project}
        />
      </SectionCard>
    </PageContainer>
  );
}