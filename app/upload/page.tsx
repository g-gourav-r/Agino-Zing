"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileUpload } from "@/components/ui/file-upload";
import { Button } from "@/components/ui/button";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  // Handle file change from the FileUpload component.
  const handleFileChange = (files: File[]) => {
    if (files && files.length > 0) {
      console.log("Selected file:", files[0]);
      setFile(files[0]);
    } else {
      console.error("No file selected or invalid file format", files);
    }
  };

  // Handle file upload.
  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    const API_URL =
      process.env.NEXT_PUBLIC_API_URL || "https://zingapi.agino.tech";

    try {
      const res = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errorText}`);
      }

      const data = await res.json();

      if (data.redis_key) {
        localStorage.setItem("redis_key", data.redis_key);
        router.push("/chat");
      } else {
        alert("Upload failed: no redis_key returned.");
      }
    } catch (error: unknown) {
      console.error("Error uploading file:", error);
      if (error instanceof Error) {
        alert(`Upload error: ${error.message}`);
      } else {
        alert("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-black">
      {/* Header */}
      <header className="bg-black shadow p-4">
        <h1 className="text-3xl font-bold text-center">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">
            Agino
          </span>{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">
            Zing
          </span>
        </h1>
      </header>

      {/* Upload Container */}
      <div className="flex-grow flex items-center justify-center p-8">
        <div className="w-full max-w-xl border-2 border-white rounded-lg bg-black p-8">
          <FileUpload onChange={handleFileChange} />
          <form onSubmit={handleUpload} className="mt-4">
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Uploading..." : "Upload File"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
