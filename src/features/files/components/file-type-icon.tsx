import {
  FileArchive,
  FileCode,
  FileImage,
  FileText,
} from "lucide-react";

export function FileTypeIcon({
  type,
}: {
  type: string;
}) {
  switch (type) {
    case "zip":
      return <FileArchive className="h-8 w-8" />;

    case "png":
    case "jpg":
    case "jpeg":
      return <FileImage className="h-8 w-8" />;

    case "pdf":
      return <FileText className="h-8 w-8" />;

    default:
      return <FileCode className="h-8 w-8" />;
  }
}