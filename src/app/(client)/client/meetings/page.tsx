import Link from "next/link";

import { createClient } from "@/lib/supabase/server";

import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";

import { Button } from "@/components/ui/button";

import { CancelMeetingButton } from "@/features/meetings/components/cancel-meeting-button";

export default async function ClientMeetingsPage() {
  const supabase =
    await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: meetings } =
    await supabase
      .from("meetings")
      .select("*")
      .eq(
        "email",
        user?.email ?? ""
      )
      .order(
        "created_at",
        {
          ascending: false,
        }
      );

  const getStatusClass = (
    status: string
  ) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-700 border-green-200";

      case "PENDING":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";

      case "COMPLETED":
        return "bg-blue-100 text-blue-700 border-blue-200";

      case "CANCELLED":
        return "bg-red-100 text-red-700 border-red-200";

      case "NO_SHOW":
        return "bg-gray-100 text-gray-700 border-gray-200";

      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <PageContainer>
      <div className="mb-6 flex items-center justify-between">
        <PageHeader
          title="My Meetings"
          description="Manage and track your meeting requests."
        />

        <Button asChild>
          <Link href="/client/meetings/book">
            Book Meeting
          </Link>
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="p-4 text-left">
                Date
              </th>

              <th className="p-4 text-left">
                Time
              </th>

              <th className="p-4 text-left">
                Type
              </th>

              <th className="p-4 text-left">
                Status
              </th>

              <th className="p-4 text-left">
                Meeting Link
              </th>

              <th className="p-4 text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {meetings?.length ? (
              meetings.map(
                (meeting) => (
                  <tr
                    key={
                      meeting.id
                    }
                    className="border-b"
                  >
                    <td className="p-4">
                      {
                        meeting.meeting_date
                      }
                    </td>

                    <td className="p-4">
                      {
                        meeting.meeting_time
                      }
                    </td>

                    <td className="p-4">
                      {
                        meeting.meeting_type
                      }
                    </td>

                    <td className="p-4">
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-medium ${getStatusClass(
                          meeting.status
                        )}`}
                      >
                        {
                          meeting.status
                        }
                      </span>
                    </td>

                    <td className="p-4">
                      {meeting.meeting_link ? (
                        <a
                          href={
                            meeting.meeting_link
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary underline"
                        >
                          Join Meeting
                        </a>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          Waiting for
                          confirmation
                        </span>
                      )}
                    </td>

                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        {meeting.meeting_link &&
                          meeting.status ===
                            "CONFIRMED" && (
                            <Button
                              asChild
                              size="sm"
                            >
                              <a
                                href={
                                  meeting.meeting_link
                                }
                                target="_blank"
                                rel="noreferrer"
                              >
                                Join
                              </a>
                            </Button>
                          )}

                        {(meeting.status ===
                          "PENDING" ||
                          meeting.status ===
                            "CONFIRMED") && (
                          <CancelMeetingButton
                            id={
                              meeting.id
                            }
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                )
              )
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="p-8 text-center text-muted-foreground"
                >
                  No meetings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </PageContainer>
  );
}