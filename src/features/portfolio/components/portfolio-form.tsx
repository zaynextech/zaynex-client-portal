"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

import { createPortfolioProject } from "@/features/portfolio/actions/create-portfolio-project";
import { updatePortfolioProject } from "@/features/portfolio/actions/update-portfolio-project";
import { UploadPortfolioImage } from "./upload-portfolio-image";
import { UploadPortfolioGallery } from "./upload-portfolio-gallery";


interface PortfolioProject {
  id: string;
  title: string;
  slug: string;
  category: string;
  short_description: string | null;
  full_description: string | null;
  thumbnail_url: string | null;
  gallery?: string[] | null;
  demo_url: string | null;
  featured: boolean | null;
  published: boolean | null;
}

interface Props {
  project?: PortfolioProject | null;
}

export function PortfolioForm({
  project,
}: Props) {
  const router =
    useRouter();

  const [loading, setLoading] =
    useState(false);

  const [title, setTitle] =
    useState(
      project?.title ?? ""
    );

  const [slug, setSlug] =
    useState(
      project?.slug ?? ""
    );

  const [category, setCategory] =
    useState(
      project?.category ?? ""
    );

  const [
    shortDescription,
    setShortDescription,
  ] = useState(
    project?.short_description ??
      ""
  );

  const [
    fullDescription,
    setFullDescription,
  ] = useState(
    project?.full_description ??
      ""
  );

  const [
    thumbnailUrl,
    setThumbnailUrl,
  ] = useState(
    project?.thumbnail_url ??
      ""
  );

  const [gallery, setGallery] =
  useState<string[]>(
    project?.gallery ?? []
  );

  const [demoUrl, setDemoUrl] =
    useState(
      project?.demo_url ?? ""
    );

  const [featured, setFeatured] =
    useState(
      project?.featured ??
        false
    );

  const [published, setPublished] =
    useState(
      project?.published ??
        true
    );
    

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    try {
      setLoading(true);

      if (project) {
        await updatePortfolioProject({
  id: project.id,
  title,
  slug,
  category,
  short_description:
    shortDescription,
  full_description:
    fullDescription,
  thumbnail_url:
    thumbnailUrl,
  gallery,
  demo_url: demoUrl,
  featured,
  published,
});
      } else {
        await createPortfolioProject({
            title,
            slug,
            category,
            short_description:
              shortDescription,
            full_description:
              fullDescription,
            thumbnail_url:
              thumbnailUrl,
            gallery,
            demo_url: demoUrl,
            featured,
            published,
          });
      }

      router.push(
        "/admin/portfolio"
      );
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={
        handleSubmit
      }
      className="space-y-6"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          placeholder="Project Title"
          value={title}
          onChange={(e) =>
            setTitle(
              e.target.value
            )
          }
          required
        />

        <Input
          placeholder="Slug"
          value={slug}
          onChange={(e) =>
            setSlug(
              e.target.value
            )
          }
          required
        />
      </div>

      <Input
        placeholder="Category"
        value={category}
        onChange={(e) =>
          setCategory(
            e.target.value
          )
        }
        required
      />

      <Textarea
        placeholder="Short Description"
        value={
          shortDescription
        }
        onChange={(e) =>
          setShortDescription(
            e.target.value
          )
        }
      />

      <Textarea
        placeholder="Full Description"
        value={
          fullDescription
        }
        onChange={(e) =>
          setFullDescription(
            e.target.value
          )
        }
        rows={8}
      />

      {/* Thumbnail Image */}
<div className="space-y-2">
  <p className="text-sm font-medium">
    Thumbnail Image
  </p>

  <UploadPortfolioImage
    value={thumbnailUrl}
    onChange={setThumbnailUrl}
  />
</div>

{/* Gallery Images */}
<div className="space-y-2">
  <p className="text-sm font-medium">
    Gallery Images
  </p>

  <UploadPortfolioGallery
    value={gallery}
    onChange={setGallery}
  />
</div>


      <Input
        placeholder="Live Demo URL"
        value={demoUrl}
        onChange={(e) =>
          setDemoUrl(
            e.target.value
          )
        }
      />

      <div className="flex flex-col gap-4 rounded-lg border p-4">
        <div className="flex items-center justify-between">
          <span>
            Featured Project
          </span>

          <Switch
            checked={
              featured
            }
            onCheckedChange={
              setFeatured
            }
          />
        </div>

        <div className="flex items-center justify-between">
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
      </div>

      <Button
        type="submit"
        disabled={loading}
      >
        {loading
          ? "Saving..."
          : project
          ? "Update Project"
          : "Create Project"}
      </Button>
    </form>
  );
}