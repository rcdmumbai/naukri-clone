"use client";

import { useRouter, useSearchParams } from "next/navigation";

const options = [
  { value: "relevance", label: "Relevance" },
  { value: "date", label: "Date posted" },
  { value: "salary", label: "Salary - high to low" },
  { value: "experience", label: "Experience - low to high" },
];

export function SortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function change(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "relevance") params.delete("sort");
    else params.set("sort", value);
    params.delete("page");
    const query = params.toString();
    router.push(`/jobs${query ? `?${query}` : ""}`);
  }

  return (
    <label className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-600">
      Sort by:
      <select
        value={searchParams.get("sort") ?? "relevance"}
        onChange={(event) => change(event.target.value)}
        className="bg-transparent font-medium text-gray-900 outline-none"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
