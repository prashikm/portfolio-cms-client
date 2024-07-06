import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getUser } from "@/lib/actions";
import apiService from "@/lib/api";
import ProjectDetail from "@/components/ProjectDetail";
import { Slash } from "lucide-react";
import Link from "next/link";

export default async function Project({ params }: any) {
  const { username, id } = params;
  const user = await getUser();

  const project = await apiService.getWithoutToken(`/api/project/${id}/`);

  return (
    <main className="mt-20 mb-56 max-w-4xl mx-auto px-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={`/${user?.username}`}>
                {user?.full_name ? user.full_name : "Home"}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <Slash />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Project</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <Slash />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>{project.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <ProjectDetail
        projectDetails={project}
        isAuthenticated={username === user?.username}
      />
    </main>
  );
}
