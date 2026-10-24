"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  jobId: string;
  alreadyApplied: boolean;
  isAuthenticated: boolean;
  isEmployer: boolean;
};

export function ApplyButton({ jobId, alreadyApplied, isAuthenticated, isEmployer }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [applied, setApplied] = useState(alreadyApplied);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isEmployer) {
    return (
      <p className="rounded-md bg-gray-100 px-4 py-2 text-sm text-naukri-muted">
        Employers cannot apply to jobs
      </p>
    );
  }

  if (applied) {
    return (
      <span className="inline-flex items-center rounded-full bg-green-50 px-5 py-2 text-sm font-medium text-green-700">
        Applied
      </span>
    );
  }

  async function submit() {
    setLoading(true);
    setError("");
    const response = await fetch(`/api/jobs/${jobId}/apply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ coverLetter }),
    });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) {
      setError(data.error ?? "Could not submit your application");
      return;
    }
    setApplied(true);
    setOpen(false);
    router.refresh();
  }

  return (
    <div>
      <button
        type="button"
        className="btn-primary"
        onClick={() => {
          if (!isAuthenticated) {
            router.push(`/login?next=/jobs/${jobId}`);
            return;
          }
          setOpen(true);
        }}
      >
        Apply
      </button>

      {open ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900">Apply to this job</h2>
            <p className="mt-1 text-sm text-naukri-muted">
              Your profile and resume details are shared with the recruiter.
            </p>
            <label className="label-field mt-4" htmlFor="coverLetter">
              Message to the recruiter (optional)
            </label>
            <textarea
              id="coverLetter"
              rows={5}
              value={coverLetter}
              onChange={(event) => setCoverLetter(event.target.value)}
              className="input-field"
              placeholder="Why are you a great fit for this role?"
            />
            {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
            <div className="mt-5 flex justify-end gap-3">
              <button type="button" onClick={() => setOpen(false)} className="btn-outline">
                Cancel
              </button>
              <button type="button" onClick={submit} disabled={loading} className="btn-primary">
                {loading ? "Submitting..." : "Submit application"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
