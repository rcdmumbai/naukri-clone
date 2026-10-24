"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  initial: {
    name: string;
    phone: string;
    location: string;
    headline: string;
    experience: string;
    currentSalary: string;
    skills: string;
    resumeText: string;
  };
};

export function ProfileForm({ initial }: Props) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [error, setError] = useState("");

  function update(key: keyof Props["initial"], value: string) {
    setForm((current) => ({ ...current, [key]: value }));
    setStatus("idle");
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("saving");
    setError("");
    const response = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        experience: form.experience === "" ? undefined : form.experience,
        currentSalary: form.currentSalary === "" ? undefined : form.currentSalary,
      }),
    });
    if (!response.ok) {
      const data = await response.json();
      setError(data.error ?? "Could not save your profile");
      setStatus("idle");
      return;
    }
    setStatus("saved");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
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
          />
        </div>
        <div>
          <label className="label-field" htmlFor="phone">
            Mobile number
          </label>
          <input
            id="phone"
            value={form.phone}
            onChange={(event) => update("phone", event.target.value)}
            className="input-field"
          />
        </div>
      </div>

      <div>
        <label className="label-field" htmlFor="headline">
          Profile headline
        </label>
        <input
          id="headline"
          value={form.headline}
          onChange={(event) => update("headline", event.target.value)}
          className="input-field"
          placeholder="e.g. Senior Software Engineer at a product company"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="label-field" htmlFor="location">
            Current location
          </label>
          <input
            id="location"
            value={form.location}
            onChange={(event) => update("location", event.target.value)}
            className="input-field"
          />
        </div>
        <div>
          <label className="label-field" htmlFor="experience">
            Experience (years)
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
          <label className="label-field" htmlFor="currentSalary">
            Current CTC (lakhs)
          </label>
          <input
            id="currentSalary"
            type="number"
            min={0}
            step="0.1"
            value={form.currentSalary}
            onChange={(event) => update("currentSalary", event.target.value)}
            className="input-field"
          />
        </div>
      </div>

      <div>
        <label className="label-field" htmlFor="skills">
          Key skills (comma separated)
        </label>
        <input
          id="skills"
          value={form.skills}
          onChange={(event) => update("skills", event.target.value)}
          className="input-field"
        />
      </div>

      <div>
        <label className="label-field" htmlFor="resumeText">
          Resume summary
        </label>
        <textarea
          id="resumeText"
          rows={6}
          value={form.resumeText}
          onChange={(event) => update("resumeText", event.target.value)}
          className="input-field"
        />
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="flex items-center gap-3">
        <button type="submit" disabled={status === "saving"} className="btn-primary">
          {status === "saving" ? "Saving..." : "Save profile"}
        </button>
        {status === "saved" ? <span className="text-sm text-green-700">Profile updated</span> : null}
      </div>
    </form>
  );
}
