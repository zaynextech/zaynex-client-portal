"use client";

import Link from "next/link";

import {
  CalendarDays,
  Clock3,
  CheckCircle2,
  XCircle,
} from "lucide-react";

interface Meeting {
  id: string;

  client_name: string;

  meeting_date: string;
  meeting_time: string;

  status: string;
  meeting_type: string;
}

interface Props {
  meetings: Meeting[];
}

export function UpcomingMeetings({
  meetings,
}: Props) {
  const today = new Date();

  const upcomingMeetings =
    meetings
      .map((meeting) => {
        const meetingDate =
          new Date(
            meeting.meeting_date
          );

        const diffDays =
          Math.ceil(
            (meetingDate.getTime() -
              today.getTime()) /
              (1000 *
                60 *
                60 *
                24)
          );

        return {
          ...meeting,
          diffDays,
        };
      })
      .sort(
        (a, b) =>
          a.diffDays -
          b.diffDays
      )
      .slice(0, 10);

  return (
    <div className="space-y-3">
      {upcomingMeetings.length ===
      0 ? (
        <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
          No meetings found.
        </div>
      ) : (
        upcomingMeetings.map(
          (meeting) => {
            const overdue =
              meeting.diffDays < 0;

            const todayMeeting =
              meeting.diffDays === 0;

            const upcoming =
              meeting.diffDays > 0;

            return (
              <Link
                key={
                  meeting.id
                }
                href={`/admin/meetings/${meeting.id}`}
                className="block rounded-xl border p-4 transition-colors hover:bg-muted/50"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-medium">
                      {
                        meeting.client_name
                      }
                    </h4>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {
                        meeting.meeting_type
                      }
                    </p>
                  </div>

                  {overdue && (
                    <span className="flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-1 text-xs text-red-500">
                      <XCircle className="h-3 w-3" />
                      Missed
                    </span>
                  )}

                  {todayMeeting && (
                    <span className="flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-1 text-xs text-green-500">
                      <CheckCircle2 className="h-3 w-3" />
                      Today
                    </span>
                  )}

                  {upcoming && (
                    <span className="flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-1 text-xs text-blue-500">
                      <CalendarDays className="h-3 w-3" />
                      {meeting.diffDays}d
                    </span>
                  )}
                </div>

                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock3 className="h-3 w-3" />
                  {
                    meeting.meeting_time
                  }
                </div>

                <div className="mt-2">
                  <span
                    className={`rounded-full px-2 py-1 text-xs ${
                      meeting.status ===
                      "CONFIRMED"
                        ? "bg-green-500/10 text-green-500"
                        : meeting.status ===
                            "PENDING"
                          ? "bg-yellow-500/10 text-yellow-500"
                          : meeting.status ===
                              "CANCELLED"
                            ? "bg-red-500/10 text-red-500"
                            : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {
                      meeting.status
                    }
                  </span>
                </div>

                <div className="mt-3 text-xs text-muted-foreground">
                  {new Date(
                    meeting.meeting_date
                  ).toLocaleDateString(
                    "en-US"
                  )}
                </div>
              </Link>
            );
          }
        )
      )}
    </div>
  );
}