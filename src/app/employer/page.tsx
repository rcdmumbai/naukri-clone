import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JobStatusToggle } from "@/components/JobStatusToggle";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPostedAt, formatSalary, humanize } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function EmployerDashboardPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "EMPLOYER") {
    return (
      <>
        <Header />
        <main className="bg-[#f7f8fc] py-16">
          <div className="container-page max-w-2xl text-center">
            <h1 className="text-2xl font-bold text-gray-900">Hire the right talent, faster</h1>
            <p className="mt-3 text-sm text-naukri-muted">
              Post jobs, reach millions of jobseekers and manage your applicants in one place.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link href="/register?role=employer" className="btn-primary">
                Register as employer
              </Link>
              <Link href="/login" className="btn-outline">
                Employer login
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const jobs = await prisma.job.findMany({
    where: { companyId: user.companyId ?? undefined },
    include: { _count: { select: { applications: true } } },
    orderBy: { postedAt: "desc" },
  });

  const totalApplications = jobs.reduce((total, job) => total + job._count.applications, 0);
  const activeJobs = jobs.filter((job) => job.isActive).length;

  return (
    <>
      <Header />
      <main className="bg-[#f7f8fc] py-8">
        <div className="container-page">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Employer dashboard</h1>
              <p className="text-sm text-naukri-muted">{user.company?.name ?? "Your company"}</p>
            </div>
            <Link href="/employer/jobs/new" className="btn-primary">
              Post a job
            </Link>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {[
              ["Total jobs", jobs.length],
              ["Active jobs", activeJobs],
              ["Applications", totalApplications],
            ].map(([label, value]) => (
              <div key={String(label)} className="card p-5">
                <p className="text-xs uppercase tracking-wide text-gray-400">{label}</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-4">
            {jobs.map((job) => (
              <div key={job.id} className="card p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <Link
                      href={`/jobs/${job.id}`}
                      className="text-sm font-medium text-gray-900 hover:text-naukri-blue"
                    >
                      {job.title}
                    </Link>
                    <p className="mt-1 text-xs text-naukri-muted">
                      {job.locations} · {formatSalary(job.minSalary, job.maxSalary)} ·{" "}
                      {humanize(job.workMode)} · Posted {formatPostedAt(job.postedAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Link
                      href={`/employer/jobs/${job.id}`}
                      className="text-sm font-medium text-naukri-blue"
                    >
                      {job._count.applications} applicant
                      {job._count.applications === 1 ? "" : "s"}
                    </Link>
                    <JobStatusToggle jobId={job.id} isActive={job.isActive} />
                  </div>
                </div>
              </div>
            ))}
            {jobs.length === 0 ? (
              <div className="card p-10 text-center">
                <p className="text-base font-medium text-gray-900">You have not posted any jobs</p>
                <Link href="/employer/jobs/new" className="btn-primary mt-4">
                  Post your first job
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
