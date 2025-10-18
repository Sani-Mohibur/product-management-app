"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect the user to the login page
    router.replace("/login");
  }, [router]);

  // Render a simple loading state while redirecting
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-dark-space p-24">
      <h1 className="text-4xl font-bold text-ghost-white">Loading...</h1>
    </main>
  );
}
