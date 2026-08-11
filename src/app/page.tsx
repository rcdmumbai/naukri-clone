import Link from "next/link";
import { Suspense } from "react";
import { ChevronRight, Star } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SearchBar } from "@/components/SearchBar";
import { CompanyLogo } from "@/components/CompanyLogo";
import { JobCard } from "@/components/JobCard";
import { POPULAR_CATEGORIES } from "@/lib/constants";
import { formatCount } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const session = await getSession();
  const [jobCount, companies, latestJobs, savedJobs] = await Promise.all([
    prisma.job.count({ where: { isActive: true } }),
    prisma.company.findMany({
      include: { _count: { select: { jobs: true } } },
      orderBy: { rating: "desc" },
      take: 8,
    }),
    prisma.job.findMany({
      where: { isActive: true },
      include: { company: true },
      orderBy: { postedAt: "desc" },
      take: 6,
    }),
    session
      ? prisma.savedJob.findMany({ where: { userId: session.userId }, select: { jobId: true } })
      : Promise.resolve([]),
  ]);

  const savedIds = new Set(savedJobs.map((item) => item.jobId));
  const industries = Array.from(new Set(companies.map((company) => company.industry))).slice(0, 5);

  return (
    <>
      <Header />
      <main>
        <section className="bg-gradient-to-b from-[#f7f8fc] to-white py-14">
          <div className="container-page text-center">
            <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">Find your dream job now</h1>
            <p className="mt-2 text-sm text-naukri-muted">
              {formatCount(jobCount)} jobs for you to explore
            </p>
            <div className="mt-8">
              <Suspense fallback={<div className="h-14" />}>
                <SearchBar />
              </Suspense>
            </div>

            <div className="mx-auto mt-10 flex max-w-4xl flex-wrap justify-center gap-3">
              {POPULAR_CATEGORIES.map((category) => (
                <Link
                  key={category.label}
                  href={`/jobs?${category.query}`}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 shadow-sm transition hover:border-naukri-blue hover:text-naukri-blue"
                >
                  {category.label}
                  <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="container-page py-10">
          <h2 className="text-center text-xl font-bold text-gray-900">Top companies hiring now</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {industries.map((industry) => {
              const industryCompanies = companies.filter((company) => company.industry === industry);
              const openings = industryCompanies.reduce(
                (total, company) => total + company._count.jobs,
                0,
              );
              return (
                <Link
                  key={industry}
                  href={`/companies?industry=${encodeURIComponent(industry)}`}
                  className="card p-4 transition hover:shadow-md"
                >
                  <p className="flex items-center gap-1 text-sm font-semibold text-gray-900">
                    {industry}
                    <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
                  </p>
                  <p className="mt-1 text-xs text-gray-500">{openings} are actively hiring</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {industryCompanies.slice(0, 4).map((company) => (
                      <CompanyLogo
                        key={company.id}
                        text={company.logoText}
                        color={company.logoColor}
                      />
                    ))}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="bg-[#f7f8fc] py-10">
          <div className="container-page">
            <h2 className="text-center text-xl font-bold text-gray-900">
              Featured companies actively hiring
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {companies.slice(0, 4).map((company) => (
                <div key={company.id} className="card flex flex-col items-center p-5 text-center">
                  <CompanyLogo text={company.logoText} color={company.logoColor} size="lg" />
                  <p className="mt-3 text-sm font-semibold text-gray-900">{company.name}</p>
                  <p className="mt-1 inline-flex items-center gap-1 text-xs text-gray-500">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    {company.rating.toFixed(1)}
                    <span className="text-gray-400">
                      {company.reviews.toLocaleString("en-IN")} reviews
                    </span>
                  </p>
                  <p className="mt-3 line-clamp-2 text-xs text-naukri-muted">{company.description}</p>
                  <Link
                    href={`/companies/${company.slug}`}
                    className="mt-4 rounded-full bg-blue-50 px-4 py-1.5 text-xs font-medium text-naukri-blue"
                  >
                    View jobs
                  </Link>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Link href="/companies" className="btn-outline">
                View all companies
              </Link>
            </div>
          </div>
        </section>

        <section className="container-page py-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Latest jobs</h2>
            <Link href="/jobs" className="text-sm font-medium text-naukri-blue">
              View all jobs
            </Link>
          </div>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {latestJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                saved={savedIds.has(job.id)}
                isAuthenticated={Boolean(session)}
              />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
