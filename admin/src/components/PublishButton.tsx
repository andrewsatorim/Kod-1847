"use client";

import { useState, useEffect } from "react";

type JobStatus = "idle" | "running" | "success" | "error";

export default function PublishButton() {
  const [status, setStatus] = useState<JobStatus>("idle");
  const [polling, setPolling] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/publish")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        setStatus(data.status ?? "idle");
        if (data.status === "running") setPolling(true);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!polling) return;
    const id = setInterval(() => {
      fetch("/api/publish")
        .then((r) => r.json())
        .then((data) => {
          setStatus(data.status ?? "idle");
          if (data.status !== "running") setPolling(false);
        })
        .catch(() => setPolling(false));
    }, 2000);
    return () => clearInterval(id);
  }, [polling]);

  async function handlePublish() {
    if (status === "running") return;
    setStatus("running");
    setPolling(true);
    try {
      await fetch("/api/publish", { method: "POST" });
    } catch {
      setStatus("error");
      setPolling(false);
    }
  }

  const label: Record<JobStatus, string> = {
    idle: "Опубликовать",
    running: "Публикуется...",
    success: "Опубликовано ✓",
    error: "Ошибка — повторить",
  };

  const color: Record<JobStatus, string> = {
    idle: "bg-gold text-panel hover:bg-gold/80",
    running: "bg-gold/40 text-panel cursor-not-allowed animate-pulse",
    success: "bg-emerald-700 text-white hover:bg-emerald-600",
    error: "bg-red-700 text-white hover:bg-red-600",
  };

  return (
    <button
      onClick={handlePublish}
      disabled={status === "running"}
      className={`w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${color[status]}`}
    >
      {label[status]}
    </button>
  );
}
