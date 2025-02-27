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
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow p-4">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
          Agino Zing
        </h1>
      </header>

      {/* Upload Container */}
      <div className="flex-grow flex items-center justify-center p-8">
        <div className="w-full max-w-xl border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-gray-800 p-8">
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
