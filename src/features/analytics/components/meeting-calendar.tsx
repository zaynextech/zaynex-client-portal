"use client";

import { useMemo, useState } from "react";

import { DayPicker } from "react-day-picker";

import "react-day-picker/dist/style.css";

interface Meeting {
  id: string;

  client_name: string;

  meeting_date: string;
  meeting_time: string;

  meeting_type: string;
  status: string;

  meeting_link?: string | null;
}

interface Props {
  meetings: Meeting[];
}

function getDateKey(
  date: string | Date
) {
  const d = new Date(date);

  const year =
    d.getFullYear();

  const month = String(
    d.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    d.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function MeetingCalendar({
  meetings,
}: Props) {
  const [selectedDate, setSelectedDate] =
    useState<Date>(
      new Date()
    );

  const meetingsByDate =
    useMemo(() => {
      const map = new Map<
        string,
        Meeting[]
      >();

      meetings.forEach(
        (meeting) => {
          const key =
            getDateKey(
              meeting.meeting_date
            );

          const existing =
            map.get(key) ?? [];

          existing.push(
            meeting
          );

          map.set(
            key,
            existing
          );
        }
      );

      return map;
    }, [meetings]);

  const meetingDates =
    meetings.map(
      (meeting) => {
        const d = new Date(
          meeting.meeting_date
        );

        return new Date(
          d.getFullYear(),
          d.getMonth(),
          d.getDate()
        );
      }
    );

  const selectedMeetings =
    meetingsByDate.get(
      getDateKey(
        selectedDate
      )
    ) ?? [];

  const getStatusClass = (
    status: string
  ) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-500/10 text-green-600 border-green-500/20";

      case "PENDING":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";

      case "CANCELLED":
        return "bg-red-500/10 text-red-600 border-red-500/20";

      case "COMPLETED":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";

      default:
        return "bg-muted";
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
      <div className="rounded-xl border p-4">
        <DayPicker
          mode="single"
          selected={
            selectedDate
          }
          onSelect={(date) =>
            date &&
            setSelectedDate(
              date
            )
          }
          modifiers={{
            meeting:
              meetingDates,
          }}
          modifiersClassNames={{
            meeting:
              "bg-green-500 text-white rounded-full",
          }}
        />

        <div className="mt-4 flex items-center gap-2 text-xs">
          <span className="h-3 w-3 rounded-full bg-green-500" />
          Meeting Scheduled
        </div>
      </div>

      <div className="rounded-xl border p-4">
        <h3 className="mb-4 font-semibold">
          {selectedDate.toLocaleDateString(
            "en-US",
            {
              weekday:
                "long",
              year: "numeric",
              month:
                "long",
              day:
                "numeric",
            }
          )}
        </h3>

        {selectedMeetings.length ===
          0 && (
          <p className="text-sm text-muted-foreground">
            No meetings on
            this date.
          </p>
        )}

        <div className="space-y-3">
          {selectedMeetings.map(
            (meeting) => (
              <div
                key={
                  meeting.id
                }
                className="rounded-xl border p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h4 className="font-medium">
                      {
                        meeting.client_name
                      }
                    </h4>

                    <p className="text-sm text-muted-foreground">
                      {
                        meeting.meeting_type
                      }
                    </p>
                  </div>

                  <span
                    className={`rounded-md border px-2 py-1 text-xs ${getStatusClass(
                      meeting.status
                    )}`}
                  >
                    {
                      meeting.status
                    }
                  </span>
                </div>

                <div className="mt-3 space-y-1 text-sm text-muted-foreground">
                  <div>
                    Time:{" "}
                    {
                      meeting.meeting_time
                    }
                  </div>

                  <div>
                    Date:{" "}
                    {new Date(
                      meeting.meeting_date
                    ).toLocaleDateString()}
                  </div>
                </div>

                {meeting.meeting_link && (
                  <a
                    href={
                      meeting.meeting_link
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-block text-sm text-primary underline"
                  >
                    Join Meeting
                  </a>
                )}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}