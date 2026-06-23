// src/features/emails/components/email-campaign-form.tsx

"use client";

import { useState, useTransition } from "react";

import { Send, Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

import { sendCampaign } from "@/features/emails/actions/send-campaign";

export function EmailCampaignForm() {
  const [pending, startTransition] =
    useTransition();

  const [campaignType, setCampaignType] =
    useState("MARKETING");

  const [audience, setAudience] =
    useState("ALL_CONTACTS");

  const [title, setTitle] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [
    includeRatingLink,
    setIncludeRatingLink,
  ] = useState(false);

  const [
    includeWebsiteLink,
    setIncludeWebsiteLink,
  ] = useState(true);

  const handleSubmit = () => {
    startTransition(async () => {
      await sendCampaign({
        campaignType,
        audience,
        title,
        message,
        includeRatingLink,
        includeWebsiteLink,
      });

      setTitle("");
      setMessage("");
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">
            Campaign Type
          </label>

          <Select
            value={campaignType}
            onValueChange={
              setCampaignType
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="MARKETING">
                Marketing
              </SelectItem>

              <SelectItem value="ANNOUNCEMENT">
                Announcement
              </SelectItem>

              <SelectItem value="HOLIDAY">
                Holiday
              </SelectItem>

              <SelectItem value="NOTICE">
                Important Notice
              </SelectItem>

              <SelectItem value="REVIEW_REQUEST">
                Review Request
              </SelectItem>

              <SelectItem value="PROJECT_UPDATE">
                Project Update
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Audience
          </label>

          <Select
            value={audience}
            onValueChange={
              setAudience
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="ALL_CONTACTS">
                All Contacts
              </SelectItem>

              <SelectItem value="SUBSCRIBERS">
                Subscribers
              </SelectItem>

              <SelectItem value="CLIENTS">
                Clients
              </SelectItem>

              <SelectItem value="CLIENTS_WITH_PROJECTS">
                Clients With Projects
              </SelectItem>

              <SelectItem value="CLIENTS_WITHOUT_PROJECTS">
                Clients Without Projects
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Title
        </label>

        <Input
          placeholder="Happy New Year 2027"
          value={title}
          onChange={(e) =>
            setTitle(
              e.target.value
            )
          }
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Message
        </label>

        <Textarea
          rows={6}
          placeholder="Write a short note..."
          value={message}
          onChange={(e) =>
            setMessage(
              e.target.value
            )
          }
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex items-center gap-3">
          <Checkbox
            checked={
              includeRatingLink
            }
            onCheckedChange={(
              checked
            ) =>
              setIncludeRatingLink(
                !!checked
              )
            }
          />

          <span className="text-sm">
            Include Review Link
          </span>
        </label>

        <label className="flex items-center gap-3">
          <Checkbox
            checked={
              includeWebsiteLink
            }
            onCheckedChange={(
              checked
            ) =>
              setIncludeWebsiteLink(
                !!checked
              )
            }
          />

          <span className="text-sm">
            Include Website Link
          </span>
        </label>
      </div>

      <div className="rounded-lg border bg-muted/30 p-4">
        <h4 className="mb-2 font-medium">
          Email Preview
        </h4>

        <p className="text-sm text-muted-foreground">
          Template:
          {" "}
          {campaignType}
        </p>

        <p className="mt-2 font-medium">
          {title ||
            "Email Title"}
        </p>

        <p className="mt-2 text-sm text-muted-foreground">
          {message ||
            "Your email content will appear here."}
        </p>
      </div>

      <div className="flex gap-3">
        <Button
          variant="outline"
          disabled={pending}
        >
          <Eye className="mr-2 h-4 w-4" />
          Preview
        </Button>

        <Button
          onClick={
            handleSubmit
          }
          disabled={
            pending ||
            !title ||
            !message
          }
        >
          <Send className="mr-2 h-4 w-4" />

          {pending
            ? "Sending..."
            : "Send Campaign"}
        </Button>
      </div>
    </div>
  );
}