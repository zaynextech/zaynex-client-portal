"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { createMeeting } from "@/features/meetings/actions/create-meeting";
import { updateMeeting } from "@/features/meetings/actions/update-meeting";

interface Meeting {
  id: string;

  client_name: string;
  email: string;
  phone: string | null;

  meeting_type: string;

  meeting_date: string;
  meeting_time: string;

  notes: string | null;

  status: string;

  meeting_link: string | null;
}

interface Props {
  meeting?: Meeting | null;
}

export function MeetingForm({
  meeting,
}: Props) {
  const router =
    useRouter();

  const [loading, setLoading] =
    useState(false);

  const [
    clientName,
    setClientName,
  ] = useState(
    meeting?.client_name ?? ""
  );

  const [email, setEmail] =
    useState(
      meeting?.email ?? ""
    );

  const [phone, setPhone] =
    useState(
      meeting?.phone ?? ""
    );

  const [
    meetingType,
    setMeetingType,
  ] = useState(
    meeting?.meeting_type ??
      "Discovery Call"
  );

  const [
    meetingDate,
    setMeetingDate,
  ] = useState(
    meeting?.meeting_date ??
      ""
  );

  const [
    meetingTime,
    setMeetingTime,
  ] = useState(
    meeting?.meeting_time ??
      ""
  );

  const [status, setStatus] =
    useState(
      meeting?.status ??
        "PENDING"
    );

  const [
    meetingLink,
    setMeetingLink,
  ] = useState(
    meeting?.meeting_link ??
      ""
  );

  const [notes, setNotes] =
    useState(
      meeting?.notes ?? ""
    );

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    try {
      setLoading(true);

      if (meeting) {
        await updateMeeting({
          id: meeting.id,

          client_name:
            clientName,

          email,

          phone,

          meeting_type:
            meetingType,

          meeting_date:
            meetingDate,

          meeting_time:
            meetingTime,

          status:
            status as
              | "PENDING"
              | "CONFIRMED"
              | "COMPLETED"
              | "CANCELLED"
              | "NO_SHOW",

          meeting_link:
            meetingLink,

          notes,
        });
      } else {
        await createMeeting({
          client_name:
            clientName,

          email,

          phone,

          meeting_type:
            meetingType,

          meeting_date:
            meetingDate,

          meeting_time:
            meetingTime,

          status:
            "PENDING",

          notes,
        });
      }

      router.push(
        "/admin/meetings"
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

        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }
          required
        />
      </div>

      <Input
        placeholder="Phone"
        value={phone}
        onChange={(e) =>
          setPhone(
            e.target.value
          )
        }
      />

      <select
        value={
          meetingType
        }
        onChange={(e) =>
          setMeetingType(
            e.target.value
          )
        }
        className="flex h-10 w-full rounded-md border bg-background px-3"
      >
        <option>
          Discovery Call
        </option>

        <option>
          Website Consultation
        </option>

        <option>
          Project Review
        </option>

        <option>
          Technical Support
        </option>

        <option>
          Other
        </option>
      </select>

      <div className="grid gap-4 md:grid-cols-2">
        <Input
          type="date"
          value={
            meetingDate
          }
          onChange={(e) =>
            setMeetingDate(
              e.target.value
            )
          }
          required
        />

        <Input
          type="time"
          value={
            meetingTime
          }
          onChange={(e) =>
            setMeetingTime(
              e.target.value
            )
          }
          required
        />
      </div>

      {meeting && (
        <>
          <select
            value={status}
            onChange={(e) =>
              setStatus(
                e.target.value
              )
            }
            className="flex h-10 w-full rounded-md border bg-background px-3"
          >
            <option value="PENDING">
              Pending
            </option>

            <option value="CONFIRMED">
              Confirmed
            </option>

            <option value="COMPLETED">
              Completed
            </option>

            <option value="CANCELLED">
              Cancelled
            </option>

            <option value="NO_SHOW">
              No Show
            </option>
          </select>

          <Input
            placeholder="Google Meet / Zoom Link"
            value={
              meetingLink
            }
            onChange={(e) =>
              setMeetingLink(
                e.target.value
              )
            }
          />
        </>
      )}

      <Textarea
        rows={6}
        placeholder="Notes"
        value={notes}
        onChange={(e) =>
          setNotes(
            e.target.value
          )
        }
      />

      <Button
        type="submit"
        disabled={loading}
      >
        {loading
          ? "Saving..."
          : meeting
          ? "Update Meeting"
          : "Create Meeting"}
      </Button>
    </form>
  );
}