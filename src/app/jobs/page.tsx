import Link from "next/link";
import { Suspense } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JobCard } from "@/components/JobCard";
import { JobFilters, type FilterCounts } from "@/components/JobFilters";
import { SortSelect } from "@/components/SortSelect";
import { getFilterCounts, searchJobs, PAGE_SIZE, type JobSearchParams } from "@/lib/jobs";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Record<string, string | string[] | undefined>;
};

function toParams(searchParams: Props["searchParams"]): JobSearchParams {
  const single = (key: string) => {
    const value = searchParams[key];
    return Array.isArray(value) ? value[0] : value;
  };
  const multi = (key: string) => {
    const value = searchParams[key];
    if (!value) return undefined;
    return Array.isArray(value) ? value : [value];
  };
  return {
    q: single("q"),
    location: single("location"),
    experience: single("experience"),
    postedWithin: single("postedWithin"),
    sort: single("sort"),
    page: single("page"),
    workMode: multi("workMode"),
    department: multi("department"),
    employmentType: multi("employmentType"),
    salary: multi("salary"),
    company: multi("company"),
  };
}

export default async function JobsPage({ searchParams }: Props) {
  const params = toParams(searchParams);
  const session = await getSession();

  const [{ jobs, total, page, pageCount }, rawCounts, savedJobs] = await Promise.all([
    searchJobs(params),
    getFilterCounts(),
    session
      ? prisma.savedJob.findMany({ where: { userId: session.userId }, select: { jobId: true } })
      : Promise.resolve([]),
  ]);

  const counts: FilterCounts = {
    workMode: Object.fromEntries(rawCounts.workMode),
    department: Object.fromEntries(rawCounts.department),
    employmentType: Object.fromEntries(rawCounts.employmentType),
    company: Object.fromEntries(rawCounts.company),
    salary: Object.fromEntries(rawCounts.salary),
  };

  const savedIds = new Set(savedJobs.map((item) => item.jobId));
  const heading = params.q
    ? `${params.q} Jobs${params.location ? ` in ${params.location}` : ""}`
    : "All jobs";

  const buildPageHref = (target: number) => {
    const next = new URLSearchParams();
    for (const [key, value] of Object.entries(searchParams)) {
      if (key === "page" || value === undefined) continue;
      if (Array.isArray(value)) value.forEach((item) => next.append(key, item));
      else next.set(key, value);
    }
    next.set("page", String(target));
    return `/jobs?${next.toString()}`;
  };

  const start = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const end = Math.min(page * PAGE_SIZE, total);

  return (
    <>
      <Header withSearch />
      <main className="bg-[#f7f8fc] py-6">
        <div className="container-page grid gap-5 lg:grid-cols-[260px_1fr]">
          <Suspense fallback={<div className="card h-96" />}>
            <JobFilters counts={counts} />
          </Suspense>

          <div>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-naukri-muted">
                <span className="font-medium text-gray-900">
                  {start}-{end} of {total}
                </span>{" "}
                {heading}
              </p>
              <Suspense fallback={null}>
                <SortSelect />
              </Suspense>
            </div>

            {jobs.length === 0 ? (
              <div className="card p-10 text-center">
                <p className="text-base font-medium text-gray-900">No jobs matched your search</p>
                <p className="mt-1 text-sm text-naukri-muted">
                  Try removing some filters or searching for a different keyword.
                </p>
                <Link href="/jobs" className="btn-outline mt-4">
                  Reset search
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    saved={savedIds.has(job.id)}
                    isAuthenticated={Boolean(session)}
                  />
                ))}
              </div>
            )}

            {pageCount > 1 ? (
              <nav className="mt-6 flex items-center justify-center gap-2">
                {Array.from({ length: pageCount }, (_, index) => index + 1).map((target) => (
                  <Link
                    key={target}
                    href={buildPageHref(target)}
                    className={`flex h-9 min-w-9 items-center justify-center rounded-md px-3 text-sm ${
                      target === page
                        ? "bg-naukri-blue text-white"
                        : "border border-gray-300 bg-white text-gray-700 hover:border-naukri-blue"
                    }`}
                  >
                    {target}
                  </Link>
                ))}
              </nav>
            ) : null}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
