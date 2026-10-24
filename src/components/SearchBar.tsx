"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";
import { EXPERIENCE_OPTIONS } from "@/lib/constants";

type Props = {
  variant?: "hero" | "compact";
};

export function SearchBar({ variant = "hero" }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const [experience, setExperience] = useState(searchParams.get("experience") ?? "");
  const [location, setLocation] = useState(searchParams.get("location") ?? "");

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (experience) params.set("experience", experience);
    if (location.trim()) params.set("location", location.trim());
    const query = params.toString();
    router.push(`/jobs${query ? `?${query}` : ""}`);
  }

  if (variant === "compact") {
    return (
      <form onSubmit={submit} className="flex w-full max-w-md items-center gap-2 rounded-full border border-gray-300 bg-gray-50 px-4 py-1.5">
        <input
          value={q}
          onChange={(event) => setQ(event.target.value)}
          placeholder="Search jobs here"
          aria-label="Search jobs"
          className="w-full bg-transparent text-sm outline-none"
        />
        <button type="submit" aria-label="Search" className="flex h-7 w-7 items-center justify-center rounded-full bg-naukri-blue text-white">
          <Search className="h-4 w-4" />
        </button>
      </form>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="mx-auto flex w-full max-w-3xl flex-col items-stretch gap-2 rounded-3xl bg-white p-3 shadow-[0_6px_24px_rgba(0,0,0,0.12)] md:flex-row md:items-center md:gap-0 md:rounded-full md:py-2 md:pl-5 md:pr-2"
    >
      <div className="flex flex-1 items-center gap-2">
        <Search className="h-4 w-4 shrink-0 text-gray-400" />
        <input
          value={q}
          onChange={(event) => setQ(event.target.value)}
          placeholder="Enter skills / designations / companies"
          aria-label="Skills, designations or companies"
          className="w-full py-2 text-sm outline-none placeholder:text-gray-400"
        />
      </div>
      <div className="hidden h-6 w-px bg-gray-200 md:block" />
      <select
        value={experience}
        onChange={(event) => setExperience(event.target.value)}
        aria-label="Select experience"
        className="border-t border-gray-200 bg-transparent px-3 py-2 text-sm text-gray-500 outline-none md:w-44 md:border-0"
      >
        <option value="">Select experience</option>
        {EXPERIENCE_OPTIONS.map((years) => (
          <option key={years} value={years}>
            {years} year{years === 1 ? "" : "s"}
          </option>
        ))}
      </select>
      <div className="hidden h-6 w-px bg-gray-200 md:block" />
      <input
        value={location}
        onChange={(event) => setLocation(event.target.value)}
        placeholder="Enter location"
        aria-label="Location"
        className="border-t border-gray-200 px-3 py-2 text-sm outline-none placeholder:text-gray-400 md:w-44 md:border-0"
      />
      <button type="submit" className="rounded-full bg-naukri-blue px-8 py-2.5 text-sm font-medium text-white transition hover:bg-[#1d4787]">
        Search
      </button>
    </form>
  );
}
