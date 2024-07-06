/* eslint-disable @next/next/no-img-element */
"use client";

import ProjectCard from "@/components/ProjectCard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { revalidateData } from "@/lib/actions";
import apiService from "@/lib/api";
import { ProjectType } from "@/lib/schema";
import { UploadcareFile, UploadClient } from "@uploadcare/upload-client";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface ProjectsProps {
  userProjects: ProjectType[];
  isAuthenticated: boolean;
  username: string;
}

export default function Projects({
  userProjects,
  isAuthenticated,
  username,
}: ProjectsProps) {
  const [isProjectCreationLoading, setIsProjectCreationLoading] =
    useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [projects, setProjects] = useState(userProjects);
  const [projectImg, setProjectImg] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);

  async function handleImageUpload(e: any) {
    const file = e.target.files[0];

    if (!file) return;

    const client = new UploadClient({
      publicKey: process.env.NEXT_PUBLIC_UPLOADCARE_KEY!,
    });

    setIsImageUploading(true);

    client
      .uploadFile(file)
      .then((result: UploadcareFile) => {
        setProjectImg(result.cdnUrl);
        toast.success("Image uploaded!");
      })
      .catch((error: any) => {
        console.log("error", error);
        toast.error("Unable to upload image, please try again");
      })
      .finally(() => {
        setIsImageUploading(false);
      });
  }

  async function handleCreateProject(e: any) {
    e.preventDefault();

    if (!e.target.title.value) {
      toast.error("Please enter a title for your project");
      return;
    }

    if (!e.target.description.value) {
      toast.error("Please enter a description for your project");
      return;
    }

    if (!projectImg) {
      toast.error("Please upload an image for your project");
      return;
    }

    setIsProjectCreationLoading(true);

    const response = await apiService.post(
      "/api/projects/",
      JSON.stringify({
        title: e.target.title.value,
        description: e.target.description.value,
        image: projectImg,
      })
    );

    if (response.error) {
      toast.error("Unable to create project");
    } else {
      formRef.current?.reset();
      setProjectImg(null);
      setOpen(false);
      setProjects([response, ...projects]);

      await revalidateData();
    }

    setIsProjectCreationLoading(false);
  }

  return (
    <div>
      <section>
        <div className="mt-10 flex items-center justify-between">
          <h1 className="text-3xl md:text-5xl font-bold">Projects</h1>
          {isAuthenticated && (
            <div>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">Create project</Button>
                </DialogTrigger>
                <DialogContent onInteractOutside={(e) => e.preventDefault()}>
                  <DialogHeader>
                    <DialogTitle>Create a new project</DialogTitle>
                    <DialogDescription>
                      Add a new project to your portfolio.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="mt-2">
                    {projectImg ? (
                      <img
                        src={projectImg}
                        alt="project-img"
                        className="w-full h-40 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-full h-40 border-2 border-dashed rounded-lg flex items-center justify-center">
                        {isImageUploading ? (
                          <div className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Uploading image...
                          </div>
                        ) : (
                          <Input
                            id="picture"
                            type="file"
                            className="w-56 cursor-pointer"
                            onInput={handleImageUpload}
                          />
                        )}
                      </div>
                    )}
                    <form
                      className="mt-6 flex flex-col gap-8"
                      onSubmit={handleCreateProject}
                      ref={formRef}
                    >
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="project-name">Project name</Label>
                        <Input
                          type="text"
                          name="title"
                          placeholder="Your short project title"
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label htmlFor="project-description">
                          Project description
                        </Label>
                        <Textarea
                          name="description"
                          placeholder="A description of your project"
                          className="h-24 resize-none"
                        />
                      </div>

                      <Button
                        disabled={isProjectCreationLoading || isImageUploading}
                      >
                        {isProjectCreationLoading && (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        )}{" "}
                        Create project
                      </Button>
                    </form>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
        <p className="mt-2">Bringing Ideas to Life</p>
      </section>

      {!projects.length && (
        <div className="mt-14 flex flex-col gap-6 justify-center items-center">
          <Image
            src="/image/empty.png"
            alt="empty"
            width={400}
            height={400}
            className="h-56 w-auto"
          />
          <p className="italic">It&apos;s empty in here...</p>
        </div>
      )}

      <section className="mt-4">
        <div className="pt-8 grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-14">
          {projects.map((project: ProjectType) => (
            <ProjectCard
              key={project.id}
              username={username}
              id={project.id}
              title={project.title}
              description={project.description}
              image={project.image}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
