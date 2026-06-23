"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

import { createTestimonial } from "@/features/testimonials/actions/create-testimonial";
import { updateTestimonial } from "@/features/testimonials/actions/update-testimonial";

interface Testimonial {
  id: string;
  client_name: string;
  role: string | null;
  company: string | null;
  rating: number;
  review_text: string;
  rating_type:
    | "GOOGLE"
    | "TRUSTPILOT";
  published: boolean;
}

interface Props {
  testimonial?: Testimonial | null;
}

export function TestimonialForm({
  testimonial,
}: Props) {
  const router =
    useRouter();

  const [loading, setLoading] =
    useState(false);

  const [
    clientName,
    setClientName,
  ] = useState(
    testimonial?.client_name ??
      ""
  );

  const [role, setRole] =
    useState(
      testimonial?.role ?? ""
    );

  const [company, setCompany] =
    useState(
      testimonial?.company ??
        ""
    );

  const [rating, setRating] =
    useState(
      testimonial?.rating ??
        5
    );

  const [
    reviewText,
    setReviewText,
  ] = useState(
    testimonial?.review_text ??
      ""
  );

  const [
    ratingType,
    setRatingType,
  ] = useState<
    "GOOGLE" | "TRUSTPILOT"
  >(
    testimonial?.rating_type ??
      "GOOGLE"
  );

  const [published, setPublished] =
    useState(
      testimonial?.published ??
        true
    );

  async function onSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        client_name:
          clientName,
        role,
        company,
        rating:
          Number(rating),
        review_text:
          reviewText,
        rating_type:
          ratingType,
        published,
      };

      if (
        testimonial
      ) {
        await updateTestimonial(
          {
            id: testimonial.id,
            ...payload,
          }
        );
      } else {
        await createTestimonial(
          payload
        );
      }

      router.push(
        "/admin/testimonials"
      );

      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={
        onSubmit
      }
      className="space-y-6"
    >
      <Input
        placeholder="Client Name"
        value={
          clientName
        }
        onChange={(e) =>
          setClientName(
            e.target.value
          )
        }
        required
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Input
          placeholder="Role"
          value={role}
          onChange={(e) =>
            setRole(
              e.target.value
            )
          }
        />

        <Input
          placeholder="Company"
          value={company}
          onChange={(e) =>
            setCompany(
              e.target.value
            )
          }
        />
      </div>

      <Input
        type="number"
        min="1"
        max="5"
        step="0.1"
        value={rating}
        onChange={(e) =>
          setRating(
            Number(
              e.target.value
            )
          )
        }
      />

      <select
        value={
          ratingType
        }
        onChange={(e) =>
          setRatingType(
            e.target
              .value as
              | "GOOGLE"
              | "TRUSTPILOT"
          )
        }
        className="w-full rounded-md border p-3"
      >
        <option value="GOOGLE">
          Google Review
        </option>

        <option value="TRUSTPILOT">
          Trustpilot Review
        </option>
      </select>

      <Textarea
        rows={6}
        placeholder="Review"
        value={
          reviewText
        }
        onChange={(e) =>
          setReviewText(
            e.target.value
          )
        }
        required
      />

      <div className="flex items-center justify-between rounded-lg border p-4">
        <span>
          Published
        </span>

        <Switch
          checked={
            published
          }
          onCheckedChange={
            setPublished
          }
        />
      </div>

      <Button
        type="submit"
        disabled={
          loading
        }
      >
        {loading
          ? "Saving..."
          : testimonial
          ? "Update Testimonial"
          : "Create Testimonial"}
      </Button>
    </form>
  );
}