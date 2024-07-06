"use client";

import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-screen px-2">
      <h2 className="text-2xl font-bold">Something went wrong</h2>
      <p className="mt-2 text-lg">{error.message}</p>
      <Button className="mt-6" onClick={() => reset()}>
        Try again
      </Button>
    </div>
  );
}
