import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FileUpload() {
  return (
    <Button>
      <Upload className="mr-2 h-4 w-4" />
      Upload File
    </Button>
  );
}