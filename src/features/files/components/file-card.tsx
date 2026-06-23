import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { ProjectFile } from "../types";
import { FileTypeIcon } from "./file-type-icon";

interface FileCardProps {
  file: ProjectFile;
}

export function FileCard({
  file,
}: FileCardProps) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex flex-col gap-4">
          <FileTypeIcon type={file.type} />

          <div>
            <h4 className="font-medium">
              {file.name}
            </h4>

            <p className="text-muted-foreground text-sm">
              {file.size}
            </p>
          </div>

          <Button className="w-full">
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}