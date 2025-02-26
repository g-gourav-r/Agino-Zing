"use client";

import { useRouter } from "next/navigation";
import { ModeToggle } from "@/components/Toggle";
import { Button } from "@/components/ui/button";
import { LampContainer } from "@/components/ui/lamp";

export default function Home() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen bg-gradient-to-r dark:to-gray-900 flex flex-col items-center justify-center">
      <div className="absolute top-5 right-5">
        <ModeToggle />
      </div>
      <LampContainer>
        <h1 className="text-5xl font-bold mb-4 text-center">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-black via-gray-700 to-gray-900">
            Agino
          </span>{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#28a745] to-[#6ddf7e]">
            Zing
          </span>
        </h1>
        <p className="text-xl text-center mb-8">
          Your quick and fast single use application
        </p>

        <button className="inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50" onClick={() => router.push("/upload")}>
          Get Started
        </button>
      </LampContainer>
    </div>
  );
}