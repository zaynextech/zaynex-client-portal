import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";

import { PortfolioForm } from "@/features/portfolio/components/portfolio-form";

export default function NewPortfolioPage() {
  return (
    <PageContainer>
      <PageHeader
        title="New Portfolio Project"
        description="Create a new portfolio project"
      />

      <SectionCard title="Project Information">
        <PortfolioForm />
      </SectionCard>
    </PageContainer>
  );
}