import Link from "next/link";

import { Button } from "@/components/ui/button";

import { DeleteTestimonialButton } from "./delete-testimonial-button";

interface Testimonial {
  id: string;
  client_name: string;
  role: string | null;
  company: string | null;
  rating: number;
  rating_type:
    | "GOOGLE"
    | "TRUSTPILOT";
  published: boolean;
}

interface Props {
  testimonials: Testimonial[];
}

export function TestimonialsTable({
  testimonials,
}: Props) {
  return (
    <div className="rounded-xl border">
      <table className="w-full">
        <thead>
          <tr className="border-b text-left">
            <th className="p-4">
              Client
            </th>

            <th className="p-4">
              Company
            </th>

            <th className="p-4">
              Rating
            </th>

            <th className="p-4">
              Source
            </th>

            <th className="p-4">
              Status
            </th>

            <th className="p-4">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {testimonials.map(
            (
              testimonial
            ) => (
              <tr
                key={
                  testimonial.id
                }
                className="border-b"
              >
                <td className="p-4">
                  {
                    testimonial.client_name
                  }
                </td>

                <td className="p-4">
                  {
                    testimonial.company
                  }
                </td>

                <td className="p-4">
                  {
                    testimonial.rating
                  }
                </td>

                <td className="p-4">
                  {testimonial.rating_type ===
                  "TRUSTPILOT" ? (
                    <span className="rounded bg-green-600 px-2 py-1 text-xs text-white">
                      Trustpilot
                    </span>
                  ) : (
                    <span className="rounded bg-blue-600 px-2 py-1 text-xs text-white">
                      Google
                    </span>
                  )}
                </td>

                <td className="p-4">
                  {testimonial.published
                    ? "Published"
                    : "Draft"}
                </td>

                <td className="p-4">
                  <div className="flex gap-2">
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                    >
                      <Link
                        href={`/admin/testimonials/${testimonial.id}`}
                      >
                        Edit
                      </Link>
                    </Button>

                    <DeleteTestimonialButton
                      id={
                        testimonial.id
                      }
                    />
                  </div>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}