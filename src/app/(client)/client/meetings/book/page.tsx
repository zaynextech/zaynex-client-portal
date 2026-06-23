"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createClientMeeting } from "@/features/meetings/actions/create-client-meeting";

import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function BookClientMeetingPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [meetingDate, setMeetingDate] = useState("");
  const [meetingTime, setMeetingTime] = useState("");
  const [notes, setNotes] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      await createClientMeeting({
        meeting_date: meetingDate,
        meeting_time: meetingTime,
        notes,
      });

      router.push("/client/meetings");
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to book meeting"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageContainer>
      <PageHeader
        title="Book Meeting"
        description="Schedule a meeting with the Zaynex team."
      />

      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-2xl space-y-5 sm:space-y-6 w-full"
      >
        {/* DUAL-COLUMN CONTAINER: 
          Stacks sequentially on small screens, splits 50/50 on tablets and desktops.
        */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Meeting Date
            </label>
            <Input
              type="date"
              required
              className="w-full rounded-xl"
              value={meetingDate}
              onChange={(e) => setMeetingDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Meeting Time
            </label>
            <Input
              type="time"
              required
              className="w-full rounded-xl"
              value={meetingTime}
              onChange={(e) => setMeetingTime(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">
            Reason For Meeting
          </label>
          <Textarea
            rows={5}
            required
            className="w-full rounded-xl resize-none"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Tell us what you would like to discuss..."
          />
        </div>

        <Button
          type="submit"
          className="w-full h-11 rounded-xl font-semibold shadow active:scale-[0.99] transition-all"
          disabled={loading}
        >
          {loading ? "Booking..." : "Book Meeting"}
        </Button>
      </form>
    </PageContainer>
  );
}