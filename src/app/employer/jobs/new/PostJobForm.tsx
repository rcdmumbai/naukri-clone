"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { DEPARTMENTS, EMPLOYMENT_TYPES, WORK_MODES } from "@/lib/constants";

export function PostJobForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    role: "",
    department: DEPARTMENTS[0],
    description: "",
    locations: "",
    skills: "",
    minExperience: "0",
    maxExperience: "3",
    minSalary: "5",
    maxSalary: "12",
    workMode: "WORK_FROM_OFFICE",
    employmentType: "FULL_TIME",
    openings: "1",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const response = await fetch("/api/employer/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) {
      setError(data.error ?? "Could not create this job");
      return;
    }
    router.push("/employer");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label-field" htmlFor="title">
            Job title
          </label>
          <input
            id="title"
            required
            value={form.title}
            onChange={(event) => update("title", event.target.value)}
            className="input-field"
            placeholder="e.g. Senior Frontend Developer"
          />
        </div>
        <div>
          <label className="label-field" htmlFor="role">
            Role
          </label>
          <input
            id="role"
            required
            value={form.role}
            onChange={(event) => update("role", event.target.value)}
            className="input-field"
            placeholder="e.g. Frontend Developer"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label-field" htmlFor="department">
            Department
          </label>
          <select
            id="department"
            value={form.department}
            onChange={(event) => update("department", event.target.value)}
            className="input-field"
          >
            {DEPARTMENTS.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label-field" htmlFor="locations">
            Locations (comma separated)
          </label>
          <input
            id="locations"
            required
            value={form.locations}
            onChange={(event) => update("locations", event.target.value)}
            className="input-field"
            placeholder="Bengaluru, Pune"
          />
        </div>
      </div>

      <div>
        <label className="label-field" htmlFor="skills">
          Key skills (comma separated)
        </label>
        <input
          id="skills"
          required
          value={form.skills}
          onChange={(event) => update("skills", event.target.value)}
          className="input-field"
          placeholder="React, TypeScript, CSS"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <div>
          <label className="label-field" htmlFor="minExperience">
            Min experience
          </label>
          <input
            id="minExperience"
            type="number"
            min={0}
            max={50}
            value={form.minExperience}
            onChange={(event) => update("minExperience", event.target.value)}
            className="input-field"
          />
        </div>
        <div>
          <label className="label-field" htmlFor="maxExperience">
            Max experience
          </label>
          <input
            id="maxExperience"
            type="number"
            min={0}
            max={50}
            value={form.maxExperience}
            onChange={(event) => update("maxExperience", event.target.value)}
            className="input-field"
          />
        </div>
        <div>
          <label className="label-field" htmlFor="minSalary">
            Min CTC (lakhs)
          </label>
          <input
            id="minSalary"
            type="number"
            min={0}
            step="0.5"
            value={form.minSalary}
            onChange={(event) => update("minSalary", event.target.value)}
            className="input-field"
          />
        </div>
        <div>
          <label className="label-field" htmlFor="maxSalary">
            Max CTC (lakhs)
          </label>
          <input
            id="maxSalary"
            type="number"
            min={0}
            step="0.5"
            value={form.maxSalary}
            onChange={(event) => update("maxSalary", event.target.value)}
            className="input-field"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="label-field" htmlFor="workMode">
            Work mode
          </label>
          <select
            id="workMode"
            value={form.workMode}
            onChange={(event) => update("workMode", event.target.value)}
            className="input-field"
          >
            {WORK_MODES.map((mode) => (
              <option key={mode.value} value={mode.value}>
                {mode.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label-field" htmlFor="employmentType">
            Employment type
          </label>
          <select
            id="employmentType"
            value={form.employmentType}
            onChange={(event) => update("employmentType", event.target.value)}
            className="input-field"
          >
            {EMPLOYMENT_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label-field" htmlFor="openings">
            Openings
          </label>
          <input
            id="openings"
            type="number"
            min={1}
            max={999}
            value={form.openings}
            onChange={(event) => update("openings", event.target.value)}
            className="input-field"
          />
        </div>
      </div>

      <div>
        <label className="label-field" htmlFor="description">
          Job description
        </label>
        <textarea
          id="description"
          rows={6}
          required
          value={form.description}
          onChange={(event) => update("description", event.target.value)}
          className="input-field"
          placeholder="Describe the responsibilities, requirements and what makes this role exciting."
        />
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <button type="submit" disabled={loading} className="btn-primary">
        {loading ? "Publishing..." : "Publish job"}
      </button>
    </form>
  );
}
