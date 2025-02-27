"use client";

import { useRouter } from "next/navigation";
import { LampContainer } from "@/components/ui/lamp";

export default function Home() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black to-gray-900 flex flex-col items-center justify-center">
      <LampContainer>
        <h1 className="text-6xl font-extrabold mb-4 text-center">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-200 to-white">
            Agino
          </span>{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-green-600">
            Zing
          </span>
        </h1>
        <p className="text-lg text-center text-gray-300 mb-8">
          Experience lightning-fast, intuitive solutions at your fingertips.
        </p>
        <button
          onClick={() => router.push("/upload")}
          className="inline-flex items-center justify-center h-14 px-8 font-bold text-white bg-gradient-to-r from-green-400 to-green-600 rounded-full shadow-lg transition-transform duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Get Started
        </button>
      </LampContainer>
    </div>
  );
}
