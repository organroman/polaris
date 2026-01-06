"use client";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

const Home = () => {
  const projects = useQuery(api.projects.get);
  const createProject = useMutation(api.projects.create);

  return (
    <div>
      <Button>Click me</Button>
    </div>
  );
};

export default Home;
