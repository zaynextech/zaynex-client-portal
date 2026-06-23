"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Sun, Moon, Loader2, CalendarRange } from "lucide-react";

export default function BookMeetingPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [form, setForm] = useState({
    client_name: "",
    email: "",
    phone: "",
    meeting_date: "",
    meeting_time: "",
    reason: "",
  });

  // Handle environment mounting to keep theme changes hydratable and error-free
  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await fetch("/api/meetings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          meeting_type: "Consultation",
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message);
      }

      router.push("/book-meeting/success");
    } catch (error) {
      console.error(error);
      alert("Failed to submit meeting request.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto max-w-2xl px-3 sm:px-4 py-8 sm:py-16 min-h-screen bg-background text-foreground transition-colors duration-200">
      
      {/* HEADER SECTION WITH RESPONSIVE DARK/LIGHT TOGGLE */}
      <div className="flex items-center justify-between gap-4 mb-6 sm:mb-8 border-b pb-3 sm:pb-4 border-border px-0.5">
        <h1 className="text-xl sm:text-4xl font-extrabold tracking-tight">
          Book a Meeting
        </h1>
        
        {isMounted && (
          <button
            type="button"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-all hover:bg-accent hover:text-accent-foreground shadow-sm active:scale-95"
            aria-label="Toggle Theme Mode"
          >
            {theme === "dark" ? (
              <Sun className="h-4.5 w-4.5 text-amber-500 transition-all scale-100" />
            ) : (
              <Moon className="h-4.5 w-4.5 text-zinc-700 transition-all scale-100" />
            )}
          </button>
        )}
      </div>

      {/* FORM ELEMENT */}
      <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-5 px-0.5">
        
        <div className="space-y-1.5">
          <input
            required
            placeholder="Full Name"
            className="w-full rounded-xl border border-input bg-background/50 p-2.5 sm:p-3.5 text-xs sm:text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all h-9 sm:h-12"
            value={form.client_name}
            onChange={(e) =>
              setForm({
                ...form,
                client_name: e.target.value,
              })
            }
          />
        </div>

        <div className="space-y-1.5">
          <input
            required
            type="email"
            placeholder="Email Address"
            className="w-full rounded-xl border border-input bg-background/50 p-2.5 sm:p-3.5 text-xs sm:text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all h-9 sm:h-12"
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
          />
        </div>

        <div className="space-y-1.5">
          <input
            type="tel"
            placeholder="Phone Number (Optional)"
            className="w-full rounded-xl border border-input bg-background/50 p-2.5 sm:p-3.5 text-xs sm:text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all h-9 sm:h-12"
            value={form.phone}
            onChange={(e) =>
              setForm({
                ...form,
                phone: e.target.value,
              })
            }
          />
        </div>

        {/* RESPONSIVE DATE & TIME FLEX GRID CORES */}
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wider pl-1">
              Preferred Date
            </label>
            <input
              required
              type="date"
              className="w-full rounded-xl border border-input bg-background/50 p-2.5 sm:p-3.5 text-xs sm:text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all h-9 sm:h-12 cursor-pointer"
              value={form.meeting_date}
              onChange={(e) =>
                setForm({
                  ...form,
                  meeting_date: e.target.value,
                })
              }
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wider pl-1">
              Preferred Time
            </label>
            <input
              required
              type="time"
              className="w-full rounded-xl border border-input bg-background/50 p-2.5 sm:p-3.5 text-xs sm:text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all h-9 sm:h-12 cursor-pointer"
              value={form.meeting_time}
              onChange={(e) =>
                setForm({
                  ...form,
                  meeting_time: e.target.value,
                })
              }
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <textarea
            required
            rows={4}
            placeholder="Reason for meeting, context, or design goals..."
            className="w-full rounded-xl border border-input bg-background/50 p-2.5 sm:p-3.5 text-xs sm:text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-none min-h-25"
            value={form.reason}
            onChange={(e) =>
              setForm({
                ...form,
                reason: e.target.value,
              })
            }
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-10 sm:h-12 rounded-xl bg-primary text-primary-foreground font-bold text-xs sm:text-sm tracking-tight shadow transition-all hover:opacity-95 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Scheduling Meeting...</span>
            </>
          ) : (
            <>
              <CalendarRange className="h-4 w-4" />
              <span>Book Meeting</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}