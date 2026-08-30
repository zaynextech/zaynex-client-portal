"use client";

import { useState } from "react";

export function UploadResourceForm() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    setLoading(true);

    try {
      const response = await fetch(
        "/api/admin/resources/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Upload failed"
        );
      }

      form.reset();
      window.location.reload();
    } catch (error) {
      console.error("RESOURCE UPLOAD ERROR:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Upload failed"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <div>
        <label className="text-sm font-medium">
          Title
        </label>

        <input
          name="title"
          required
          placeholder="Sales Guide"
          className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="text-sm font-medium">
          Description
        </label>

        <textarea
          name="description"
          placeholder="Useful information for salespeople"
          className="mt-1 min-h-24 w-full rounded-md border bg-background px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="text-sm font-medium">
          Category
        </label>

        <select
          name="category"
          required
          className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
        >
          <option value="">Select category</option>
          <option value="Sales Materials">
            Sales Materials
          </option>
          <option value="Company Information">
            Company Information
          </option>
          <option value="Service Information">
            Service Information
          </option>
          <option value="Sales Guides">
            Sales Guides
          </option>
          <option value="Other">
            Other
          </option>
        </select>
      </div>

      <div>
        <label className="text-sm font-medium">
          PDF
        </label>

        <input
          type="file"
          name="file"
          accept="application/pdf"
          required
          className="mt-1 block w-full text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
      >
        {loading ? "Uploading..." : "Upload Resource"}
      </button>
    </form>
  );
}