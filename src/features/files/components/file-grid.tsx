import { ProjectFile } from "../types";
import { FileCard } from "./file-card";

export function FileGrid({
  files,
}: {
  files: ProjectFile[];
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {files.map((file) => (
        <FileCard
          key={file.id}
          file={file}
        />
      ))}
    </div>
  );
}