"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function Chat() {
  const [message, setMessage] = useState<string>("");
  const [chatLog, setChatLog] = useState<
    { user: string; bot: string; isStreaming?: boolean }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Auto-scroll chat container when new messages arrive.
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chatLog]);

  // On mount, load session_id from localStorage if available.
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedSession = localStorage.getItem("session_id");
      if (storedSession) {
        setSessionId(storedSession);
      }
    }
  }, []);

  const startNewChat = () => {
    // Clear session_id from localStorage and state.
    localStorage.removeItem("session_id");
    setSessionId(null);
    // Optionally clear the current chat log.
    setChatLog([]);
  };

  const useDifferentDatabase = () => {
    // Clear all local storage and navigate to the upload page.
    localStorage.clear();
    router.push("/upload");
  };

  const sendMessage = async () => {
    if (!message.trim()) return; // avoid sending empty messages
    if (typeof window !== "undefined") {
      // Retrieve the latest redis_key and session_id from localStorage.
      const redisKey = localStorage.getItem("redis_key");
      const storedSession = localStorage.getItem("session_id");

      if (!redisKey) {
        alert("Please upload a file first.");
        return;
      }

      setLoading(true);
      const formData = new FormData();
      formData.append("redis_key", redisKey);
      formData.append("message", message);
      const sessionValue = sessionId || storedSession;
      if (sessionValue) {
        formData.append("session_id", sessionValue);
      }

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const errorText = await res.text();
          console.error("Server Error:", res.status, errorText);
          alert(`Error: ${res.status} - ${errorText}`);
          setLoading(false);
          return;
        }

        // Append user message and a placeholder for bot response.
        setChatLog((prev) => [
          ...prev,
          { user: message, bot: "", isStreaming: true },
        ]);

        // Process the streaming response.
        const reader = res.body?.getReader();
        if (!reader) throw new Error("No response body");
        const decoder = new TextDecoder("utf-8");
        let done = false;
        let botResponse = "";
        while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;
          if (value) {
            const chunk = decoder.decode(value, { stream: true });
            // Sanitize chunk by removing all "data:" prefixes.
            const sanitizedChunk = chunk.replace(/data:\s*/g, "");
            botResponse += sanitizedChunk;
            setChatLog((prev) => {
              const updated = [...prev];
              updated[updated.length - 1].bot = botResponse;
              return updated;
            });
          }
        }

        // If the API returns a session_id in the header for the first message.
        const newSessionId = res.headers.get("x-session-id");
        if (!sessionId && newSessionId) {
          localStorage.setItem("session_id", newSessionId);
          setSessionId(newSessionId);
        }

        setMessage("");
      } catch (error: unknown) {
        console.error("Network Error:", error);
        alert("Network Error. Check console for details.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navbar */}
      <header className="bg-white dark:bg-gray-800 shadow p-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
          Chat with Bot
        </h1>
        <div className="flex space-x-2">
          <button
            onClick={startNewChat}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg shadow"
          >
            Start New Chat
          </button>
          <button
            onClick={useDifferentDatabase}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow"
          >
            Use Different Database
          </button>
        </div>
      </header>

      {/* Chat log */}
      <div
        ref={chatContainerRef}
        className="flex-grow p-4 overflow-y-auto space-y-4"
      >
        {chatLog.map((entry, index) => (
          <div key={index} className="flex flex-col space-y-2">
            {/* User Message Bubble */}
            <div className="flex justify-end">
              <div className="bg-blue-600 text-white px-4 py-3 rounded-lg max-w-md shadow-lg">
                <p className="text-sm">{entry.user}</p>
              </div>
            </div>
            {/* Bot Message Bubble */}
            <div className="flex justify-start">
              <div className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-3 rounded-lg max-w-md shadow-lg">
                <p className="text-sm whitespace-pre-wrap">{entry.bot}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Message input */}
      <form
        onSubmit={handleSubmit}
        className="p-4 border-t border-gray-300 dark:border-gray-700 flex items-center"
      >
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        />
        <button
          type="submit"
          disabled={loading}
          className="ml-4 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
}
