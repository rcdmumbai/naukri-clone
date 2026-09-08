import { notFound } from "next/navigation";
import { Star } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CompanyLogo } from "@/components/CompanyLogo";
import { JobCard } from "@/components/JobCard";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function CompanyPage({ params }: { params: { slug: string } }) {
  const session = await getSession();
  const company = await prisma.company.findUnique({
    where: { slug: params.slug },
    include: {
      jobs: { where: { isActive: true }, include: { company: true }, orderBy: { postedAt: "desc" } },
    },
  });

  if (!company) notFound();

  const savedJobs = session
    ? await prisma.savedJob.findMany({ where: { userId: session.userId }, select: { jobId: true } })
    : [];
  const savedIds = new Set(savedJobs.map((item) => item.jobId));

  return (
    <>
      <Header withSearch />
      <main className="bg-[#f7f8fc] py-8">
        <div className="container-page space-y-5">
          <div className="card flex flex-wrap items-start gap-5 p-6">
            <CompanyLogo text={company.logoText} color={company.logoColor} size="lg" />
            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-bold text-gray-900">{company.name}</h1>
              <p className="mt-1 inline-flex items-center gap-1 text-sm text-gray-500">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                {company.rating.toFixed(1)} · {company.reviews.toLocaleString("en-IN")} reviews ·{" "}
                {company.industry}
                {company.size ? ` · ${company.size}` : ""}
              </p>
              <p className="mt-3 text-sm text-naukri-muted">{company.description}</p>
            </div>
          </div>

          <div>
            <h2 className="mb-3 text-base font-semibold text-gray-900">
              {company.jobs.length} job{company.jobs.length === 1 ? "" : "s"} at {company.name}
            </h2>
            <div className="space-y-4">
              {company.jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  saved={savedIds.has(job.id)}
                  isAuthenticated={Boolean(session)}
                />
              ))}
              {company.jobs.length === 0 ? (
                <div className="card p-8 text-center text-sm text-naukri-muted">
                  This company has no active openings right now.
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
