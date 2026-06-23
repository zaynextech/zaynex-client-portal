"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";

import { DeleteMeetingButton } from "./delete-meeting-button";

interface Meeting {
  id: string;

  client_name: string;
  email: string;
  phone: string | null;

  meeting_type: string;

  meeting_date: string;
  meeting_time: string;

  status: string;

  meeting_link: string | null;

  created_at: string;
}

interface Props {
  meetings: Meeting[];
}

export function MeetingsTable({
  meetings,
}: Props) {
  if (
    !meetings ||
    meetings.length === 0
  ) {
    return (
      <div className="rounded-lg border p-8 text-center">
        No meetings found.
      </div>
    );
  }

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
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="p-3 text-left">
              Client
            </th>

            <th className="p-3 text-left">
              Email
            </th>

            <th className="p-3 text-left">
              Type
            </th>

            <th className="p-3 text-left">
              Date
            </th>

            <th className="p-3 text-left">
              Time
            </th>

            <th className="p-3 text-left">
              Status
            </th>

            <th className="p-3 text-left">
              Meeting Link
            </th>

            <th className="p-3 text-right">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {meetings.map(
            (meeting) => (
              <tr
                key={meeting.id}
                className="border-b"
              >
                <td className="p-3 font-medium">
                  {
                    meeting.client_name
                  }
                </td>

                <td className="p-3">
                  {meeting.email}
                </td>

                <td className="p-3">
                  {
                    meeting.meeting_type
                  }
                </td>

                <td className="p-3">
                  {
                    meeting.meeting_date
                  }
                </td>

                <td className="p-3">
                  {
                    meeting.meeting_time
                  }
                </td>

                <td className="p-3">
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-medium ${getStatusClass(
                      meeting.status
                    )}`}
                  >
                    {meeting.status}
                  </span>
                </td>

                <td className="p-3">
                  {meeting.meeting_link ? (
                    <a
                      href={
                        meeting.meeting_link
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary underline"
                    >
                      Open Link
                    </a>
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      Not set
                    </span>
                  )}
                </td>

                <td className="p-3">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/meetings/${meeting.id}`}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                      >
                        Edit
                      </Button>
                    </Link>

                    <DeleteMeetingButton
                      id={
                        meeting.id
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