"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Client {
  id: string;
  full_name: string | null;
  email: string;
}

interface ProjectFormProps {
  clients: Client[];
  onSubmit: (data: {
    client_id: string;
    name: string;
    description: string;
    budget: number;
    start_date: string;
    due_date: string;
  }) => Promise<void>;
}

export function ProjectForm({
  clients,
  onSubmit,
}: ProjectFormProps) {
  const [loading, setLoading] = useState(false);

  const [clientId, setClientId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] =
    useState("");
  const [budget, setBudget] = useState("");
  const [startDate, setStartDate] =
    useState("");
  const [dueDate, setDueDate] =
    useState("");

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      await onSubmit({
        client_id: clientId,
        name,
        description,
        budget: Number(budget) || 0,
        start_date: startDate,
        due_date: dueDate,
      });

      setClientId("");
      setName("");
      setDescription("");
      setBudget("");
      setStartDate("");
      setDueDate("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Client
        </label>

        <select
          value={clientId}
          onChange={(e) =>
            setClientId(e.target.value)
          }
          className="w-full rounded-md border bg-background px-3 py-2"
          required
        >
          <option value="">
            Select Client
          </option>

          {clients.map((client) => (
            <option
              key={client.id}
              value={client.id}
            >
              {client.full_name ||
                client.email}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Project Name
        </label>

        <Input
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          placeholder="Website Redesign"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Description
        </label>

        <Textarea
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
          placeholder="Project description..."
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Budget
        </label>

        <Input
          type="number"
          value={budget}
          onChange={(e) =>
            setBudget(e.target.value)
          }
          placeholder="500"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Start Date
          </label>

          <Input
            type="date"
            value={startDate}
            onChange={(e) =>
              setStartDate(e.target.value)
            }
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Due Date
          </label>

          <Input
            type="date"
            value={dueDate}
            onChange={(e) =>
              setDueDate(e.target.value)
            }
          />
        </div>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={loading}
      >
        {loading
          ? "Creating..."
          : "Create Project"}
      </Button>
    </form>
  );
}