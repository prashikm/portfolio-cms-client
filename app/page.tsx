import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Home() {
  return (
    <main className="mt-20 mb-56 max-w-2xl mx-auto px-6 text-center">
      <h1 className="text-3xl font-bold md:text-4xl">
        Make your portfolio and showcase your work to the world.
      </h1>
      <div className="mt-10 flex justify-center gap-6 items-center">
        <Button variant="outline" asChild>
          <Link href="/login">Login</Link>
        </Button>
        or
        <Button asChild>
          <Link href="/signup">Sign up</Link>
        </Button>
      </div>
    </main>
  );
}
