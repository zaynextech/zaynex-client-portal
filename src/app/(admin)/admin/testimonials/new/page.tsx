import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";

import { TestimonialForm } from "@/features/testimonials/components/testimonial-form";

export default function NewTestimonialPage() {
  return (
    <PageContainer>
      <PageHeader
        title="New Testimonial"
        description="Create a client review"
      />

      <TestimonialForm />
    </PageContainer>
  );
}