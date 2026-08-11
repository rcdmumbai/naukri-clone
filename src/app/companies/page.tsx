import Link from "next/link";
import { Star } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CompanyLogo } from "@/components/CompanyLogo";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: { industry?: string };
};

export default async function CompaniesPage({ searchParams }: Props) {
  const companies = await prisma.company.findMany({
    where: searchParams.industry ? { industry: searchParams.industry } : undefined,
    include: { _count: { select: { jobs: true } } },
    orderBy: { name: "asc" },
  });

  const industries = await prisma.company.findMany({
    select: { industry: true },
    distinct: ["industry"],
    orderBy: { industry: "asc" },
  });

  return (
    <>
      <Header withSearch />
      <main className="bg-[#f7f8fc] py-8">
        <div className="container-page">
          <h1 className="text-xl font-bold text-gray-900">Top companies hiring now</h1>

          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/companies"
              className={`rounded-full border px-3 py-1.5 text-sm ${
                searchParams.industry
                  ? "border-gray-300 bg-white text-gray-700"
                  : "border-naukri-blue bg-blue-50 text-naukri-blue"
              }`}
            >
              All
            </Link>
            {industries.map(({ industry }) => (
              <Link
                key={industry}
                href={`/companies?industry=${encodeURIComponent(industry)}`}
                className={`rounded-full border px-3 py-1.5 text-sm ${
                  searchParams.industry === industry
                    ? "border-naukri-blue bg-blue-50 text-naukri-blue"
                    : "border-gray-300 bg-white text-gray-700"
                }`}
              >
                {industry}
              </Link>
            ))}
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {companies.map((company) => (
              <Link key={company.id} href={`/companies/${company.slug}`} className="card p-5 transition hover:shadow-md">
                <div className="flex items-center gap-3">
                  <CompanyLogo text={company.logoText} color={company.logoColor} size="md" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{company.name}</p>
                    <p className="inline-flex items-center gap-1 text-xs text-gray-500">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      {company.rating.toFixed(1)} · {company.reviews.toLocaleString("en-IN")} reviews
                    </p>
                  </div>
                </div>
                <p className="mt-3 line-clamp-2 text-sm text-naukri-muted">{company.description}</p>
                <p className="mt-3 text-xs font-medium text-naukri-blue">
                  {company._count.jobs} open job{company._count.jobs === 1 ? "" : "s"}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
