"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

type Role = "JOBSEEKER" | "EMPLOYER";

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [role, setRole] = useState<Role>(
    searchParams.get("role") === "employer" ? "EMPLOYER" : "JOBSEEKER",
  );
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    location: "",
    experience: "0",
    skills: "",
    companyName: "",
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
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, role }),
    });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) {
      setError(data.error ?? "Something went wrong");
      return;
    }
    router.push(data.redirectTo);
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="mt-5 space-y-4">
      <div className="grid grid-cols-2 gap-2">
        {(["JOBSEEKER", "EMPLOYER"] as Role[]).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setRole(value)}
            className={`rounded-md border px-4 py-2 text-sm font-medium transition ${
              role === value
                ? "border-naukri-blue bg-blue-50 text-naukri-blue"
                : "border-gray-300 text-gray-600"
            }`}
          >
            {value === "JOBSEEKER" ? "I am a jobseeker" : "I am an employer"}
          </button>
        ))}
      </div>

      <div>
        <label className="label-field" htmlFor="name">
          Full name
        </label>
        <input
          id="name"
          required
          value={form.name}
          onChange={(event) => update("name", event.target.value)}
          className="input-field"
          placeholder="What is your name?"
        />
      </div>

      <div>
        <label className="label-field" htmlFor="email">
          Email ID
        </label>
        <input
          id="email"
          type="email"
          required
          value={form.email}
          onChange={(event) => update("email", event.target.value)}
          className="input-field"
          placeholder="Tell us your email"
        />
      </div>

      <div>
        <label className="label-field" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          minLength={8}
          value={form.password}
          onChange={(event) => update("password", event.target.value)}
          className="input-field"
          placeholder="Minimum 8 characters"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label-field" htmlFor="phone">
            Mobile number
          </label>
          <input
            id="phone"
            value={form.phone}
            onChange={(event) => update("phone", event.target.value)}
            className="input-field"
            placeholder="10 digit number"
          />
        </div>
        <div>
          <label className="label-field" htmlFor="location">
            Current location
          </label>
          <input
            id="location"
            value={form.location}
            onChange={(event) => update("location", event.target.value)}
            className="input-field"
            placeholder="e.g. Bengaluru"
          />
        </div>
      </div>

      {role === "JOBSEEKER" ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label-field" htmlFor="experience">
              Total experience (years)
            </label>
            <input
              id="experience"
              type="number"
              min={0}
              max={50}
              value={form.experience}
              onChange={(event) => update("experience", event.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="label-field" htmlFor="skills">
              Key skills
            </label>
            <input
              id="skills"
              value={form.skills}
              onChange={(event) => update("skills", event.target.value)}
              className="input-field"
              placeholder="React, Java, SQL"
            />
          </div>
        </div>
      ) : (
        <div>
          <label className="label-field" htmlFor="companyName">
            Company name
          </label>
          <input
            id="companyName"
            required
            value={form.companyName}
            onChange={(event) => update("companyName", event.target.value)}
            className="input-field"
            placeholder="Your company"
          />
        </div>
      )}

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? "Creating account..." : "Register now"}
      </button>
    </form>
  );
}
