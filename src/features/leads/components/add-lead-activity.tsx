"use client";

import { useState } from "react";
import {
  Phone,
  MessageCircle,
  Mail,
  FileText,
  Calendar,
} from "lucide-react";
import { createLeadActivity } from "@/features/leads/actions/create-lead-activity";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ActivityDate } from "./activity-date";

type Activity = {
  id: string;
  type: string;
  subject?: string | null;
  notes: string;
  follow_up_at?: string | null;
  created_at: string;
};

type Props = {
  leadId: string;
  activities?: Activity[];
};

function getActivityIcon(type: string) {
  switch (type) {
    case "CALL":
      return <Phone className="h-4 w-4" />;
    case "WHATSAPP":
      return <MessageCircle className="h-4 w-4" />;
    case "EMAIL":
      return <Mail className="h-4 w-4" />;
    case "MEETING":
      return <Calendar className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
}

export function AddLeadActivity({
  leadId,
  activities = [],
}: Props) {
  const [type, setType] = useState("CALL");

  return (
    <div className="space-y-6">
      <form
        action={createLeadActivity}
        className="space-y-4"
      >
        <input
          type="hidden"
          name="lead_id"
          value={leadId}
        />

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Activity Type
          </label>

          <select
            name="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
          >
            <option value="CALL">Call</option>
            <option value="WHATSAPP">WhatsApp</option>
            <option value="EMAIL">Email</option>
            <option value="MEETING">Meeting</option>
            <option value="NOTE">Note</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Subject
          </label>

          <Input
            name="subject"
            placeholder="e.g. Discussed website project"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Notes
          </label>

          <Textarea
            name="notes"
            rows={4}
            placeholder="What happened?"
            required
            className="resize-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Follow-up
          </label>

          <Input
            name="follow_up_at"
            type="datetime-local"
          />
        </div>

        <Button type="submit">
          Add Activity
        </Button>
      </form>

      {activities.length > 0 && (
        <div className="border-t pt-6">
          <h3 className="mb-4 font-semibold">
            Activity History
          </h3>

          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex gap-3 rounded-lg border p-4"
              >
                <div className="mt-0.5">
                  {getActivityIcon(activity.type)}
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-medium">
                    {activity.subject ||
                      activity.type.replace("_", " ")}
                  </p>

                  <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">
                    {activity.notes}
                  </p>

                  <div className="mt-2">
                    <ActivityDate
                      date={activity.created_at}
                    />
                  </div>

                  {activity.follow_up_at && (
                    <p className="mt-1 text-xs font-medium">
                      Follow-up:{" "}
                      <ActivityDate
                        date={activity.follow_up_at}
                      />
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activities.length === 0 && (
        <p className="border-t pt-6 text-sm text-muted-foreground">
          No activities recorded yet.
        </p>
      )}
    </div>
  );
}