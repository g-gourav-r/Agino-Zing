// pages/chat.js
import { useState, useEffect } from "react";
import ThemeToggle from "../components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);

  // Retrieve stored redis_key from localStorage
  const redis_key =
    typeof window !== "undefined" ? localStorage.getItem("redis_key") : null;

  // On mount, check if a session_id already exists in localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedSession = localStorage.getItem("session_id");
      if (storedSession) {
        setSessionId(storedSession);
      }
    }
  }, []);

  const sendMessage = async () => {
    if (!message) return;
    if (!redis_key) {
      alert("Please upload a file first.");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("redis_key", redis_key);
    formData.append("message", message);
    if (sessionId) {
      formData.append("session_id", sessionId);
    }
    try {
      const res = await fetch("http://43.204.193.123:8000/chat", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      // On first message, store the returned session_id
      if (!sessionId && data.session_id) {
        localStorage.setItem("session_id", data.session_id);
        setSessionId(data.session_id);
      }
      setChatLog((prev) => [
        ...prev,
        { user: message, bot: data.response || "No response" },
      ]);
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Message sending error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      <ThemeToggle />
      <div className="flex-grow p-4 overflow-y-auto">
        {chatLog.map((entry, index) => (
          <Card key={index} className="mb-4">
            <CardContent>
              <p className="text-blue-600">You: {entry.user}</p>
              <p className="text-gray-800 dark:text-gray-200">
                Bot: {entry.bot}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="p-4 flex gap-2">
        <Input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow"
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send"}
        </Button>
      </form>
    </div>
  );
}
