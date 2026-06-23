import { TicketMessage } from "./ticket-message";

export function TicketThread() {
  return (
    <div className="space-y-4">
      <TicketMessage
        author="Client"
        message="Need some homepage changes."
      />

      <TicketMessage
        author="Zaynex"
        message="We have started working on it."
      />
    </div>
  );
}