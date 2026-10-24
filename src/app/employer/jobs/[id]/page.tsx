import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ApplicationStatusSelect } from "@/components/ApplicationStatusSelect";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPostedAt, formatSalary, splitList } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function EmployerJobApplicantsPage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=/employer/jobs/${params.id}`);
  if (user.role !== "EMPLOYER") redirect("/jobs");

  const job = await prisma.job.findUnique({
    where: { id: params.id },
    include: {
      applications: { include: { user: true }, orderBy: { appliedAt: "desc" } },
    },
  });

  if (!job || job.companyId !== user.companyId) notFound();

  return (
    <>
      <Header />
      <main className="bg-[#f7f8fc] py-8">
        <div className="container-page">
          <Link href="/employer" className="text-sm text-naukri-blue">
            ← Back to dashboard
          </Link>
          <h1 className="mt-2 text-xl font-bold text-gray-900">{job.title}</h1>
          <p className="text-sm text-naukri-muted">
            {job.locations} · {formatSalary(job.minSalary, job.maxSalary)} ·{" "}
            {job.applications.length} applicant{job.applications.length === 1 ? "" : "s"}
          </p>

          <div className="mt-5 space-y-4">
            {job.applications.map((application) => (
              <div key={application.id} className="card p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900">{application.user.name}</p>
                    <p className="text-xs text-naukri-muted">
                      {application.user.headline ?? "Jobseeker"} ·{" "}
                      {application.user.location ?? "Location not specified"} ·{" "}
                      {application.user.experience ?? 0} yrs
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {application.user.email}
                      {application.user.phone ? ` · ${application.user.phone}` : ""}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {splitList(application.user.skills)
                        .slice(0, 6)
                        .map((skill) => (
                          <span key={skill} className="chip">
                            {skill}
                          </span>
                        ))}
                    </div>
                    {application.coverLetter ? (
                      <p className="mt-3 rounded-md bg-gray-50 p-3 text-sm text-naukri-muted">
                        {application.coverLetter}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-xs text-gray-500">
                      Applied {formatPostedAt(application.appliedAt)}
                    </span>
                    <ApplicationStatusSelect
                      applicationId={application.id}
                      status={application.status}
                    />
                  </div>
                </div>
              </div>
            ))}
            {job.applications.length === 0 ? (
              <div className="card p-10 text-center text-sm text-naukri-muted">
                No applications received yet.
              </div>
            ) : null}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
