"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Bookmark } from "lucide-react";

type Props = {
  jobId: string;
  initialSaved: boolean;
  isAuthenticated: boolean;
};

export function SaveJobButton({ jobId, initialSaved, isAuthenticated }: Props) {
  const [saved, setSaved] = useState(initialSaved);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  async function toggle() {
    if (!isAuthenticated) {
      router.push(`/login?next=/jobs/${jobId}`);
      return;
    }
    const next = !saved;
    setSaved(next);
    const response = await fetch(`/api/jobs/${jobId}/save`, {
      method: next ? "POST" : "DELETE",
    });
    if (!response.ok) {
      setSaved(!next);
      return;
    }
    startTransition(() => router.refresh());
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={pending}
      aria-pressed={saved}
      className={`inline-flex items-center gap-1.5 text-sm ${saved ? "text-naukri-blue" : "text-gray-500"} hover:text-naukri-blue`}
    >
      <Bookmark className={`h-4 w-4 ${saved ? "fill-current" : ""}`} />
      {saved ? "Saved" : "Save"}
    </button>
  );
}
