import { getUser } from "@/lib/actions";
import apiService from "@/lib/api";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Slash } from "lucide-react";
import Link from "next/link";
import Projects from "@/components/Projects";

export default async function ProjectsPage({
  params,
}: {
  params: { username: string };
}) {
  const user = await getUser();

  const projects = await apiService.getWithoutToken(
    `/api/projects/${params.username}`
  );

  if (projects.error) {
    throw new Error(projects.error.message.detail);
  }

  return (
    <main className="mt-20 mb-56 max-w-5xl mx-auto px-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">{user?.full_name ? user.full_name : "Home"}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <Slash />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Projects</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Projects
        userProjects={projects}
        isAuthenticated={user?.username === params.username}
        username={params.username}
      />
    </main>
  );
}
