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

type Contact = {
  id: string;
  email: string | null;
  role: string | null;
};

type Subscriber = {
  id: string;
  email: string;
};

type Props = {
  contacts: Contact[];
  subscribers: Subscriber[];
};

export function EmailCampaignForm({
  contacts,
  subscribers,
}: Props) {
  const [pending, startTransition] = useTransition();

  const [campaignType, setCampaignType] =
    useState("GENERAL");

  const [audience, setAudience] =
    useState("INDIVIDUALS");

  const [selectedContacts, setSelectedContacts] =
    useState<string[]>([]);

  const [selectedRole, setSelectedRole] =
    useState("CLIENT");

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const [includeRatingLink, setIncludeRatingLink] =
    useState(false);

  const [includeWebsiteLink, setIncludeWebsiteLink] =
    useState(true);

  const roles = [
    {
      value: "CLIENT",
      label: "Clients",
    },
    {
      value: "DEVELOPER",
      label: "Developers",
    },
    {
      value: "SALES",
      label: "Sales",
    },
    {
      value: "ADMIN",
      label: "Admins",
    },
  ];

  const filteredContacts =
    audience === "ROLE"
      ? contacts.filter(
          (contact) => contact.role === selectedRole
        )
      : contacts;

  const toggleContact = (id: string) => {
    setSelectedContacts((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  const selectAll = () => {
    setSelectedContacts(
      filteredContacts
        .filter((contact) => contact.email)
        .map((contact) => contact.id)
    );
  };

  const clearSelection = () => {
    setSelectedContacts([]);
  };

  const handleAudienceChange = (value: string) => {
    setAudience(value);
    setSelectedContacts([]);
  };

  const handleSubmit = () => {
    startTransition(async () => {
      await sendCampaign({
        campaignType,
        audience,
        selectedContacts,
        selectedRole,
        title,
        message,
        includeRatingLink,
        includeWebsiteLink,
      });

      setTitle("");
      setMessage("");
      setSelectedContacts([]);
    });
  };

  const recipientCount =
    audience === "ALL_CONTACTS"
      ? contacts.filter((contact) => contact.email).length
      : audience === "SUBSCRIBERS"
        ? subscribers.length
        : audience === "ROLE"
          ? filteredContacts.filter(
              (contact) => contact.email
            ).length
          : selectedContacts.length;

  return (
    <div className="space-y-6">

      {/* Campaign Type + Audience */}
      <div className="grid gap-4 md:grid-cols-2">

        {/* Campaign Type */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Email Type
          </label>

          <Select
            value={campaignType}
            onValueChange={setCampaignType}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select email type" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="GENERAL">
                General
              </SelectItem>

              <SelectItem value="ANNOUNCEMENT">
                Announcement
              </SelectItem>

              <SelectItem value="WELCOME">
                Welcome
              </SelectItem>

              <SelectItem value="PROJECT_UPDATE">
                Project Update
              </SelectItem>

              <SelectItem value="PROJECT_COMPLETED">
                Project Completed
              </SelectItem>

              <SelectItem value="TASK_UPDATE">
                Task Update
              </SelectItem>

              <SelectItem value="PAYMENT_INVOICE">
                Payment / Invoice
              </SelectItem>

              <SelectItem value="ACCOUNT_ACCESS">
                Account / Access
              </SelectItem>

              <SelectItem value="REVIEW_REQUEST">
                Review Request
              </SelectItem>

              <SelectItem value="NOTICE">
                Important Notice
              </SelectItem>

              <SelectItem value="MARKETING">
                Marketing
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Audience */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Send To
          </label>

          <Select
            value={audience}
            onValueChange={handleAudienceChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select recipients" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="INDIVIDUALS">
                Select People
              </SelectItem>

              <SelectItem value="ROLE">
                Select By Role
              </SelectItem>

              <SelectItem value="ALL_CONTACTS">
                Everyone
              </SelectItem>

              <SelectItem value="SUBSCRIBERS">
                Newsletter Subscribers
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Role Selection */}
      {audience === "ROLE" && (
        <div>
          <label className="mb-2 block text-sm font-medium">
            Select Role
          </label>

          <Select
            value={selectedRole}
            onValueChange={(value) => {
              setSelectedRole(value);
              setSelectedContacts([]);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>

            <SelectContent>
              {roles.map((role) => (
                <SelectItem
                  key={role.value}
                  value={role.value}
                >
                  {role.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Recipient Selection */}
      {(audience === "INDIVIDUALS" ||
        audience === "ROLE") && (
        <div className="space-y-3">

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">
              Recipients
            </label>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={selectAll}
                className="text-sm underline"
              >
                Select All
              </button>

              <button
                type="button"
                onClick={clearSelection}
                className="text-sm text-muted-foreground underline"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="max-h-64 space-y-1 overflow-y-auto rounded-lg border p-2">

            {filteredContacts
              .filter((contact) => contact.email)
              .map((contact) => (
                <label
                  key={contact.id}
                  className="flex cursor-pointer items-center gap-3 rounded-md p-3 hover:bg-muted"
                >
                  <Checkbox
                    checked={selectedContacts.includes(
                      contact.id
                    )}
                    onCheckedChange={() =>
                      toggleContact(contact.id)
                    }
                  />

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {contact.email}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {contact.role}
                    </p>
                  </div>
                </label>
              ))}

            {filteredContacts.filter(
              (contact) => contact.email
            ).length === 0 && (
              <p className="p-4 text-center text-sm text-muted-foreground">
                No recipients found.
              </p>
            )}

          </div>

          <p className="text-sm text-muted-foreground">
            {selectedContacts.length} recipient
            {selectedContacts.length !== 1
              ? "s"
              : ""}{" "}
            selected
          </p>
        </div>
      )}

      {/* Everyone */}
      {audience === "ALL_CONTACTS" && (
        <div className="rounded-lg border bg-muted/30 p-4">
          <p className="font-medium">Everyone</p>

          <p className="text-sm text-muted-foreground">
            This email will be sent to{" "}
            <span className="font-medium text-foreground">
              {recipientCount}
            </span>{" "}
            registered contacts with an email address.
          </p>
        </div>
      )}

      {/* Subscribers */}
      {audience === "SUBSCRIBERS" && (
        <div className="rounded-lg border bg-muted/30 p-4">
          <p className="font-medium">
            Newsletter Subscribers
          </p>

          <p className="text-sm text-muted-foreground">
            This email will be sent to{" "}
            <span className="font-medium text-foreground">
              {subscribers.length}
            </span>{" "}
            active newsletter subscribers.
          </p>
        </div>
      )}

      {/* Title */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          Subject
        </label>

        <Input
          placeholder="Enter email subject"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* Message */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          Message
        </label>

        <Textarea
          rows={7}
          placeholder="Write your email message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      {/* Optional Links */}
      <div className="space-y-3">
        <label className="text-sm font-medium">
          Optional Links
        </label>

        <div className="grid gap-4 md:grid-cols-2">

          <label className="flex items-center gap-3">
            <Checkbox
              checked={includeRatingLink}
              onCheckedChange={(checked) =>
                setIncludeRatingLink(!!checked)
              }
            />

            <span className="text-sm">
              Include Review Link
            </span>
          </label>

          <label className="flex items-center gap-3">
            <Checkbox
              checked={includeWebsiteLink}
              onCheckedChange={(checked) =>
                setIncludeWebsiteLink(!!checked)
              }
            />

            <span className="text-sm">
              Include Website Link
            </span>
          </label>

        </div>
      </div>

      {/* Email Preview */}
      <div className="rounded-lg border bg-muted/30 p-4">

        <div className="mb-3 flex items-center justify-between">
          <h4 className="font-medium">
            Email Preview
          </h4>

          <span className="text-xs text-muted-foreground">
            {campaignType}
          </span>
        </div>

        <p className="font-medium">
          {title || "Email Subject"}
        </p>

        <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
          {message ||
            "Your email content will appear here."}
        </p>

        <div className="mt-4 border-t pt-3">
          <p className="text-xs text-muted-foreground">
            Recipients:{" "}
            <span className="font-medium text-foreground">
              {recipientCount}
            </span>
          </p>
        </div>

      </div>

      {/* Actions */}
      <div className="flex gap-3">

        <Button
          variant="outline"
          disabled={pending}
          type="button"
        >
          <Eye className="mr-2 h-4 w-4" />
          Preview
        </Button>

        <Button
          type="button"
          onClick={handleSubmit}
          disabled={
            pending ||
            !title.trim() ||
            !message.trim() ||
            ((audience === "INDIVIDUALS" ||
              audience === "ROLE") &&
              selectedContacts.length === 0)
          }
        >
          <Send className="mr-2 h-4 w-4" />

          {pending
            ? "Sending..."
            : "Send Email"}
        </Button>

      </div>
    </div>
  );
}