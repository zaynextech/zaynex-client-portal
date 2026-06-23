import Link from "next/link";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";

import { getPortfolioProjects } from "@/features/portfolio/actions/get-portfolio-projects";
import { PortfolioTable } from "@/features/portfolio/components/portfolio-table";

export default async function PortfolioPage() {
  const projects =
    await getPortfolioProjects();

  return (
    <PageContainer>
      <PageHeader
        title="Portfolio"
        description="Manage portfolio projects"
        action={
          <Button asChild>
            <Link
              href="/admin/portfolio/new"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Link>
          </Button>
        }
      />

      <SectionCard title="Projects">
        <PortfolioTable
          projects={projects}
        />
      </SectionCard>
    </PageContainer>
  );
}