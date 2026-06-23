import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";

import { AddClientForm } from "@/features/clients/components/add-client-form";

export default function NewClientPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Add Client"
        description="Create a new client account."
      />

      <AddClientForm />
    </PageContainer>
  );
}