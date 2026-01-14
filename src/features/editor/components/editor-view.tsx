import Image from "next/image";

import { Id } from "../../../../convex/_generated/dataModel";

import FileBreadCrumbs from "./file-breadcrambs";
import TopNavigation from "./top-navaigation";
import CodeEditor from "./code-editor";

import { useEditor } from "../hooks/use-editor";

import { useFile, useUpdateFile } from "@/features/projects/hooks/use-files";
import { useRef } from "react";

const DEBOUNCE_MS = 1500;

const EditorView = ({ projectId }: { projectId: Id<"projects"> }) => {
  const { activeTab } = useEditor(projectId);
  const activeFile = useFile(activeTab);
  const updateFile = useUpdateFile();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isActiveFileBinary = activeFile && activeFile.storageId;
  const isActiveFileText = activeFile && !activeFile.storageId;

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center">
        <TopNavigation projectId={projectId} />
      </div>
      {activeTab && <FileBreadCrumbs projectId={projectId} />}
      <div className="flex-1 min-h-0 bg-background">
        {!activeFile && (
          <div className="size-full flex items-center justify-center">
            <Image
              src="/logo-alt.svg"
              alt="Polaris"
              width={50}
              height={50}
              className="opacity-25"
            />
          </div>
        )}
        {isActiveFileText && (
          <CodeEditor
            key={activeFile._id}
            fileName={activeFile.name}
            initialValue={activeFile.content ?? ""}
            onChange={(content: string) => {
              if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
              }

              timeoutRef.current = setTimeout(() => {
                updateFile({ id: activeFile._id, content });
              }, DEBOUNCE_MS);
            }}
          />
        )}
        {isActiveFileBinary && <p>TODO: Implement binary preview</p>}
      </div>
    </div>
  );
};

export default EditorView;
