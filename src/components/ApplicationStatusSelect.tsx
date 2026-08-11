"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { APPLICATION_STATUSES } from "@/lib/constants";
import { humanize } from "@/lib/format";

type Props = {
  applicationId: string;
  status: string;
};

export function ApplicationStatusSelect({ applicationId, status }: Props) {
  const router = useRouter();
  const [value, setValue] = useState(status);
  const [loading, setLoading] = useState(false);

  async function change(next: string) {
    const previous = value;
    setValue(next);
    setLoading(true);
    const response = await fetch(`/api/employer/applications/${applicationId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    setLoading(false);
    if (!response.ok) {
      setValue(previous);
      return;
    }
    router.refresh();
  }

  return (
    <select
      value={value}
      disabled={loading}
      onChange={(event) => change(event.target.value)}
      aria-label="Application status"
      className="rounded-md border border-gray-300 px-2 py-1 text-xs text-gray-800 outline-none focus:border-naukri-blue"
    >
      {APPLICATION_STATUSES.map((option) => (
        <option key={option} value={option}>
          {humanize(option)}
        </option>
      ))}
    </select>
  );
}
