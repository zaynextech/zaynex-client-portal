import { createClient } from "@/lib/supabase/server";
import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { UploadResourceForm } from "@/features/resources/components/upload-resource-form";
import { DeleteResourceButton } from "@/features/resources/components/delete-resource-button";

export default async function AdminResourcesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role?.toUpperCase() !== "ADMIN") {
    return null;
  }

  const { data: resources, error } = await supabase
    .from("resources")
    .select(`
      id,
      title,
      description,
      category,
      file_url,
      file_public_id,
      created_at
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(
      "GET ADMIN RESOURCES ERROR:",
      JSON.stringify(error, null, 2)
    );
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeader
          title="Resources"
          description="Manage sales resources and downloadable documents."
        />

        <SectionCard title="Upload Resource">
          <UploadResourceForm />
        </SectionCard>

        <SectionCard title={`Resources (${resources?.length ?? 0})`}>
          <div className="space-y-3">
            {resources?.map((resource) => (
              <div
                key={resource.id}
                className="flex flex-col gap-3 rounded-xl border border-border/60 bg-muted/10 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <h3 className="font-semibold">
                    {resource.title}
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    {resource.category}
                  </p>

                  {resource.description && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {resource.description}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <a
                    href={resource.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted"
                  >
                    View PDF
                  </a>

                  <DeleteResourceButton
                    resourceId={resource.id}
                  />
                </div>
              </div>
            ))}

            {!resources?.length && (
              <div className="rounded-xl border border-dashed p-8 text-center">
                <p className="font-medium">
                  No resources yet
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Upload resources to make them available to salespeople.
                </p>
              </div>
            )}
          </div>
        </SectionCard>
      </div>
    </PageContainer>
  );
}