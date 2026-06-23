import type { Metadata } from "next";
import BookMeetingClient from "./book-meeting-client";



export const metadata: Metadata = {
  title: "Book a Meeting",
  description:
    "Schedule a consultation with the Zaynex team.",
};

export default function BookMeetingPage() {
  return <BookMeetingClient />;
}