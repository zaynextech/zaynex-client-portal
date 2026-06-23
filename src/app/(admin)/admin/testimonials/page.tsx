import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";

import Link from "next/link";

import { getTestimonials } from "@/features/testimonials/actions/get-testimonials";
import { TestimonialsTable } from "@/features/testimonials/components/testimonials-table";

export default async function TestimonialsPage() {
  const testimonials =
    await getTestimonials();

  return (
    <PageContainer>
      <div className="flex items-center justify-between">
        <PageHeader
          title="Testimonials"
          description="Manage client reviews"
        />

        <Button asChild>
          <Link href="/admin/testimonials/new">
            Add Testimonial
          </Link>
        </Button>
      </div>

      <TestimonialsTable
        testimonials={testimonials}
      />
    </PageContainer>
  );
}