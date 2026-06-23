"use client";

import Link from "next/link";

import { Eye, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";

import Image from "next/image";

interface PortfolioProject {
  id: string;
  title: string;
  slug: string;
  category: string;
  thumbnail_url: string | null;
  featured: boolean | null;
  published: boolean | null;
  created_at: string;
}

interface Props {
  projects: PortfolioProject[];
}

export function PortfolioTable({
  projects,
}: Props) {
  return (
    <div className="overflow-hidden rounded-lg border">
      <table className="w-full">
        <thead className="border-b bg-muted/50">
          <tr>
            <th className="p-4 text-left">
              Thumbnail
            </th>

            <th className="p-4 text-left">
              Title
            </th>

            <th className="p-4 text-left">
              Category
            </th>

            <th className="p-4 text-left">
              Featured
            </th>

            <th className="p-4 text-left">
              Published
            </th>

            <th className="p-4 text-left">
              Created
            </th>

            <th className="p-4 text-right">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {projects.length ===
          0 ? (
            <tr>
              <td
                colSpan={7}
                className="p-8 text-center text-muted-foreground"
              >
                No portfolio
                projects found.
              </td>
            </tr>
          ) : (
            projects.map(
              (project) => (
                <tr
                  key={project.id}
                  className="border-b"
                >
                  <td className="p-4">
                    {project.thumbnail_url ? (
                      <Image
                            src={project.thumbnail_url}
                            alt={project.title}
                            width={80}
                            height={56}
                            className="h-14 w-20 rounded border object-cover"
                            />
                    ) : (
                      <div className="flex h-14 w-20 items-center justify-center rounded border text-xs text-muted-foreground">
                        No Image
                      </div>
                    )}
                  </td>

                  <td className="p-4 font-medium">
                    {
                      project.title
                    }
                  </td>

                  <td className="p-4">
                    {
                      project.category
                    }
                  </td>

                  <td className="p-4">
                    {project.featured
                      ? "Yes"
                      : "No"}
                  </td>

                  <td className="p-4">
                    {project.published
                      ? "Published"
                      : "Draft"}
                  </td>

                  <td className="p-4">
                    {new Date(
                      project.created_at
                    ).toLocaleDateString(
                      "en-GB"
                    )}
                  </td>

                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <Button
                        asChild
                        size="icon"
                        variant="outline"
                      >
                        <Link
                          href={`/portfolio/${project.slug}`}
                          target="_blank"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>

                      <Button
                        asChild
                        size="icon"
                        variant="outline"
                      >
                        <Link
                          href={`/admin/portfolio/${project.id}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </td>
                </tr>
              )
            )
          )}
        </tbody>
      </table>
    </div>
  );
}