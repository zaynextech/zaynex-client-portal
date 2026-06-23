import { notFound } from "next/navigation";

import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";

import { getTestimonial } from "@/features/testimonials/actions/get-testimonial";
import { TestimonialForm } from "@/features/testimonials/components/testimonial-form";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditTestimonialPage({
  params,
}: Props) {
  const { id } =
    await params;

  const testimonial =
    await getTestimonial(id);

  if (!testimonial) {
    notFound();
  }

  return (
    <PageContainer>
      <PageHeader
        title="Edit Testimonial"
        description="Update testimonial"
      />

      <TestimonialForm
        testimonial={testimonial}
      />
    </PageContainer>
  );
}