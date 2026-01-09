import { AlertCircleIcon, GlobeIcon, Loader2Icon } from "lucide-react";
import { Doc } from "../../../convex/_generated/dataModel";
import { FaGithub } from "react-icons/fa";
import { cn } from "@/lib/utils";

export const getProjectIcon = (project: Doc<"projects">, size: string) => {
  if (project.importStatus === "completed") {
    return <FaGithub className={cn("text-muted-foreground", size)} />;
  }

  if (project.importStatus === "failed") {
    return <AlertCircleIcon className={cn("text-muted-foreground", size)} />;
  }

  if (project.importStatus === "importing") {
    return <Loader2Icon className={cn("text-muted-foreground", size)} />;
  }

  return <GlobeIcon className={cn("text-muted-foreground", size)} />;
};
