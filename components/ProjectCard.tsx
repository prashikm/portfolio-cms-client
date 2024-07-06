/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

interface ProjectCardProps {
  username: string;
  id: number;
  title: string;
  description: string;
  image: string;
}

export default function ProjectCard({
  username,
  id,
  title,
  description,
  image,
}: ProjectCardProps) {
  return (
    <Link href={`/${username}/project/${id}`} className="group rounded-lg">
      <div className="flex justify-center items-center">
        <img
          src={image}
          alt={title}
          className="h-[200px] w-full md:h-[260px] rounded-lg object-cover border border-slate-200 transition delay-75 duration-300 ease-in-out group-hover:scale-105 dark:border-none"
        />
      </div>
      <div className="mt-4">
        <h2 className="font-bold text-2xl md:text-3xl">{title}</h2>
        <p className="mt-2">
          {description.length > 200
            ? description.slice(0, 200) + "..."
            : description}
        </p>
      </div>
    </Link>
  );
}
