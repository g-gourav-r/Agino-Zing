"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ModeToggle } from "@/components/Toggle";
import { FileUpload } from "@/components/ui/file-upload";
import { Button } from "@/components/ui/button";

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleFileChange = (e) => {
    // If FileUpload passes an event, grab the first file.
    if (e.target && e.target.files) {
      setFile(e.target.files[0]);
    } else {
      // If FileUpload passes the file directly.
      setFile(e);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("http://43.204.193.123:8000/chat", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      // Expecting the API to return a "redis_key"
      if (data.redis_key) {
        localStorage.setItem("redis_key", data.redis_key);
        router.push("/chat");
      } else {
        alert("Upload failed: no redis_key returned.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Upload error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-100 dark:bg-black space-y-4">
      {/* <ModeToggle /> */}
      <div className="w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg p-8">
        {/* Use the correct onChange prop */}
        <FileUpload onChange={handleFileChange} />
        <Button onClick={handleUpload} disabled={loading} className="mt-4">
          {loading ? "Uploading..." : "Upload File"}
        </Button>
      </div>
    </div>
  );
}
