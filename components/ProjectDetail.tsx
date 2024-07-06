"use client";

import { useState } from "react";
import { ImageUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import apiService from "@/lib/api";
import { UploadClient } from "@uploadcare/upload-client";
import { ProjectType } from "@/lib/schema";
import { toast } from "sonner";
import { revalidateData } from "@/lib/actions";

interface ProjectProps {
  projectDetails: ProjectType;
  isAuthenticated: boolean;
}

export default function ProjectDetail({
  projectDetails,
  isAuthenticated,
}: ProjectProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [project, setProject] = useState(projectDetails);
  const [editProject, setEditProject] = useState(projectDetails);
  const [isEditing, setIsEditing] = useState(false);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const client = new UploadClient({
      publicKey: process.env.NEXT_PUBLIC_UPLOADCARE_KEY!,
    });

    setIsImageUploading(true);

    client
      .uploadFile(file)
      .then((result: any) => {
        setEditProject({ ...editProject, image: result.cdnUrl });
        toast.success("Image uploaded!");
      })
      .catch((error: any) => {
        console.log("error", error);
        toast.error("Unable to upload image, please try again");
      })
      .finally(() => {
        setIsImageUploading(false);
      });
  };

  const handleProjectUpdate = async () => {
    setIsUpdating(true);
    const response = await apiService.update(
      `/api/project/update/${project.id}/`,
      JSON.stringify(editProject)
    );

    if (response.error) {
      console.error(response.error);
      toast.error(response.error.message.detail);
    } else {
      setProject(editProject);
      setIsEditing(false);
      await revalidateData();
    }

    setIsUpdating(false);
  };

  return (
    <div>
      <div className="mt-10 flex items-center justify-between gap-4">
        {isEditing ? (
          <Input
            placeholder="Project Title"
            value={editProject.title}
            onChange={(e) =>
              setEditProject({ ...editProject, title: e.target.value })
            }
          />
        ) : (
          <h1 className="text-3xl md:text-5xl font-bold">{project.title}</h1>
        )}
        {isAuthenticated && (
          <div>
            {isEditing ? (
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleProjectUpdate} disabled={isUpdating}>
                  {isUpdating && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save
                </Button>
              </div>
            ) : (
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                Edit
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="mt-6">
        <div className="relative">
          <img
            src={isEditing ? editProject.image : project.image}
            alt={project.title}
            className="w-full h-[200px] md:h-[460px] object-cover rounded-lg"
          />
          {isEditing && (
            <div className="absolute top-6 right-6 z-20 bg-white rounded-full p-2 shadow-md cursor-pointer">
              <input
                type="file"
                id="projectImg"
                name="projectImage"
                onChange={handleImageUpload}
                disabled={isImageUploading}
                hidden
              />
              <label
                htmlFor="projectImg"
                className="cursor-pointer flex items-center gap-2"
              >
                <ImageUp className="h-4 w-4" />
                <p className="text-sm text-gray-500">Change image</p>
              </label>
            </div>
          )}
        </div>
      </div>

      <article className="max-w-2xl mx-auto mt-6">
        {isEditing ? (
          <div
            contentEditable={isEditing}
            suppressContentEditableWarning
            className="p-4 border border-gray-300 rounded-lg"
            onInput={(e: any) =>
              setEditProject({
                ...editProject,
                description: e.target.innerText,
              })
            }
          >
            {project.description}
          </div>
        ) : (
          <p className="md:text-lg">{project.description}</p>
        )}
      </article>
    </div>
  );
}
