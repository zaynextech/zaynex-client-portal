import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ClientForm() {
  return (
    <form className="space-y-4">
      <Input placeholder="Client Name" />

      <Input placeholder="Email Address" />

      <Input placeholder="Company Name" />

      <Button className="w-full">
        Save Client
      </Button>
    </form>
  );
}