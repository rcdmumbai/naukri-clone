"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ChevronUp } from "lucide-react";
import { EMPLOYMENT_TYPES, POSTED_WITHIN, SALARY_BUCKETS, WORK_MODES } from "@/lib/constants";

export type FilterCounts = {
  workMode: Record<string, number>;
  department: Record<string, number>;
  employmentType: Record<string, number>;
  company: Record<string, { name: string; count: number }>;
  salary: Record<string, number>;
};

type Props = {
  counts: FilterCounts;
};

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-gray-200 py-4 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between text-sm font-semibold text-gray-900"
      >
        {title}
        <ChevronUp className={`h-4 w-4 transition ${open ? "" : "rotate-180"}`} />
      </button>
      {open ? <div className="mt-3 space-y-2">{children}</div> : null}
    </div>
  );
}

export function JobFilters({ counts }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showAllDepartments, setShowAllDepartments] = useState(false);
  const [showAllCompanies, setShowAllCompanies] = useState(false);

  function toggle(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    const existing = params.getAll(key);
    params.delete(key);
    for (const item of existing.filter((entry) => entry !== value)) params.append(key, item);
    if (!existing.includes(value)) params.append(key, value);
    params.delete("page");
    router.push(`/jobs?${params.toString()}`);
  }

  function setSingle(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page");
    router.push(`/jobs?${params.toString()}`);
  }

  function clearAll() {
    const params = new URLSearchParams();
    const q = searchParams.get("q");
    const location = searchParams.get("location");
    if (q) params.set("q", q);
    if (location) params.set("location", location);
    const query = params.toString();
    router.push(`/jobs${query ? `?${query}` : ""}`);
  }

  const selected = (key: string, value: string) => searchParams.getAll(key).includes(value);

  const departments = Object.entries(counts.department).sort((a, b) => b[1] - a[1]);
  const companies = Object.entries(counts.company).sort((a, b) => b[1].count - a[1].count);

  const checkbox = (key: string, value: string, label: string, count?: number) => (
    <label key={value} className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
      <input
        type="checkbox"
        checked={selected(key, value)}
        onChange={() => toggle(key, value)}
        className="h-4 w-4 rounded border-gray-300 text-naukri-blue focus:ring-naukri-blue"
      />
      <span className="flex-1">{label}</span>
      {count !== undefined ? <span className="text-xs text-gray-400">({count})</span> : null}
    </label>
  );

  return (
    <aside className="card h-fit p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900">All Filters</h2>
        <button type="button" onClick={clearAll} className="text-xs font-medium text-naukri-blue">
          Clear all
        </button>
      </div>

      <Section title="Work mode">
        {WORK_MODES.map((mode) =>
          checkbox("workMode", mode.value, mode.label, counts.workMode[mode.value] ?? 0),
        )}
      </Section>

      <Section title="Experience">
        <input
          type="range"
          min={0}
          max={30}
          value={searchParams.get("experience") ?? "0"}
          onChange={(event) => setSingle("experience", event.target.value)}
          className="w-full accent-naukri-blue"
          aria-label="Years of experience"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>0 Yrs</span>
          <span>{searchParams.get("experience") ? `${searchParams.get("experience")} Yrs` : "Any"}</span>
          <span>30 Yrs</span>
        </div>
      </Section>

      <Section title="Department">
        {(showAllDepartments ? departments : departments.slice(0, 5)).map(([value, count]) =>
          checkbox("department", value, value, count),
        )}
        {departments.length > 5 ? (
          <button
            type="button"
            onClick={() => setShowAllDepartments((value) => !value)}
            className="text-xs font-medium text-naukri-blue"
          >
            {showAllDepartments ? "View Less" : "View More"}
          </button>
        ) : null}
      </Section>

      <Section title="Salary">
        {SALARY_BUCKETS.map((bucket) =>
          checkbox("salary", bucket.value, bucket.label, counts.salary[bucket.value] ?? 0),
        )}
      </Section>

      <Section title="Employment type">
        {EMPLOYMENT_TYPES.map((type) =>
          checkbox("employmentType", type.value, type.label, counts.employmentType[type.value] ?? 0),
        )}
      </Section>

      <Section title="Company">
        {(showAllCompanies ? companies : companies.slice(0, 6)).map(([slug, value]) =>
          checkbox("company", slug, value.name, value.count),
        )}
        {companies.length > 6 ? (
          <button
            type="button"
            onClick={() => setShowAllCompanies((value) => !value)}
            className="text-xs font-medium text-naukri-blue"
          >
            {showAllCompanies ? "View Less" : "View More"}
          </button>
        ) : null}
      </Section>

      <Section title="Freshness">
        {POSTED_WITHIN.map((option) => (
          <label key={option.value} className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
            <input
              type="radio"
              name="postedWithin"
              checked={searchParams.get("postedWithin") === option.value}
              onChange={() => setSingle("postedWithin", option.value)}
              className="h-4 w-4 border-gray-300 text-naukri-blue focus:ring-naukri-blue"
            />
            {option.label}
          </label>
        ))}
      </Section>
    </aside>
  );
}
