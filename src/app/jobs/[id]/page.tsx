import Link from "next/link";
import { notFound } from "next/navigation";
import { Briefcase, IndianRupee, MapPin, Star, Users } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CompanyLogo } from "@/components/CompanyLogo";
import { JobCard } from "@/components/JobCard";
import { ApplyButton } from "@/components/ApplyButton";
import { SaveJobButton } from "@/components/SaveJobButton";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { formatExperience, formatPostedAt, formatSalary, humanize, splitList } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function JobDetailPage({ params }: { params: { id: string } }) {
  const session = await getSession();
  const job = await prisma.job.findUnique({
    where: { id: params.id },
    include: { company: true, _count: { select: { applications: true } } },
  });

  if (!job) notFound();

  const [application, saved, similarJobs] = await Promise.all([
    session
      ? prisma.application.findUnique({
          where: { jobId_userId: { jobId: job.id, userId: session.userId } },
        })
      : Promise.resolve(null),
    session
      ? prisma.savedJob.findUnique({
          where: { jobId_userId: { jobId: job.id, userId: session.userId } },
        })
      : Promise.resolve(null),
    prisma.job.findMany({
      where: { id: { not: job.id }, isActive: true, department: job.department },
      include: { company: true },
      orderBy: { postedAt: "desc" },
      take: 4,
    }),
  ]);

  const locations = splitList(job.locations);
  const skills = splitList(job.skills);

  return (
    <>
      <Header withSearch />
      <main className="bg-[#f7f8fc] py-6">
        <div className="container-page grid gap-5 lg:grid-cols-[1fr_300px]">
          <div className="space-y-5">
            <div className="card p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">{job.title}</h1>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-naukri-muted">
                    <Link href={`/companies/${job.company.slug}`} className="hover:text-naukri-blue">
                      {job.company.name}
                    </Link>
                    <span className="inline-flex items-center gap-1 text-xs">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      {job.company.rating.toFixed(1)}
                    </span>
                    <span className="text-xs text-gray-400">
                      {job.company.reviews.toLocaleString("en-IN")} Reviews
                    </span>
                  </div>
                </div>
                <CompanyLogo text={job.company.logoText} color={job.company.logoColor} size="md" />
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-naukri-muted">
                <span className="inline-flex items-center gap-1.5">
                  <Briefcase className="h-4 w-4" />
                  {formatExperience(job.minExperience, job.maxExperience)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <IndianRupee className="h-4 w-4" />
                  {formatSalary(job.minSalary, job.maxSalary)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {locations.join(", ")}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Users className="h-4 w-4" />
                  {job.openings} openings
                </span>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4">
                <div className="text-xs text-gray-500">
                  Posted {formatPostedAt(job.postedAt)} · {job._count.applications} applicants
                </div>
                <div className="flex items-center gap-4">
                  <SaveJobButton
                    jobId={job.id}
                    initialSaved={Boolean(saved)}
                    isAuthenticated={Boolean(session)}
                  />
                  <ApplyButton
                    jobId={job.id}
                    alreadyApplied={Boolean(application)}
                    isAuthenticated={Boolean(session)}
                    isEmployer={session?.role === "EMPLOYER"}
                  />
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h2 className="text-base font-semibold text-gray-900">Job description</h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-naukri-muted">
                {job.description}
              </p>

              <dl className="mt-6 grid gap-4 sm:grid-cols-2">
                {[
                  ["Role", job.role],
                  ["Department", job.department],
                  ["Employment type", humanize(job.employmentType)],
                  ["Work mode", humanize(job.workMode)],
                  ["Industry", job.company.industry],
                  ["Openings", String(job.openings)],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-xs uppercase tracking-wide text-gray-400">{label}</dt>
                    <dd className="text-sm text-gray-800">{value}</dd>
                  </div>
                ))}
              </dl>

              <h3 className="mt-6 text-sm font-semibold text-gray-900">Key skills</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span key={skill} className="chip">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {similarJobs.length ? (
              <div>
                <h2 className="mb-3 text-base font-semibold text-gray-900">Similar jobs</h2>
                <div className="space-y-4">
                  {similarJobs.map((similar) => (
                    <JobCard key={similar.id} job={similar} isAuthenticated={Boolean(session)} />
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <aside className="space-y-5">
            <div className="card p-5">
              <div className="flex items-center gap-3">
                <CompanyLogo text={job.company.logoText} color={job.company.logoColor} size="md" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">{job.company.name}</p>
                  <p className="text-xs text-gray-500">{job.company.industry}</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-naukri-muted">{job.company.description}</p>
              <Link href={`/companies/${job.company.slug}`} className="btn-outline mt-4 w-full">
                View company
              </Link>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
