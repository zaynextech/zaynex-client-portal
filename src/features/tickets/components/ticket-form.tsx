import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function TicketForm() {
  return (
    <form className="space-y-4">
      <Input placeholder="Subject" />

      <Textarea
        placeholder="Describe your issue"
      />

      <Button className="w-full">
        Submit Ticket
      </Button>
    </form>
  );
}