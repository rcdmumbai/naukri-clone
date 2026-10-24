import Link from "next/link";
import { redirect } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CompanyLogo } from "@/components/CompanyLogo";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPostedAt, humanize } from "@/lib/format";

export const dynamic = "force-dynamic";

const statusStyles: Record<string, string> = {
  APPLIED: "bg-blue-50 text-naukri-blue",
  SHORTLISTED: "bg-amber-50 text-amber-700",
  REJECTED: "bg-red-50 text-red-700",
  HIRED: "bg-green-50 text-green-700",
};

export default async function ApplicationsPage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/applications");
  if (session.role === "EMPLOYER") redirect("/employer");

  const applications = await prisma.application.findMany({
    where: { userId: session.userId },
    include: { job: { include: { company: true } } },
    orderBy: { appliedAt: "desc" },
  });

  return (
    <>
      <Header withSearch />
      <main className="bg-[#f7f8fc] py-8">
        <div className="container-page">
          <h1 className="text-xl font-bold text-gray-900">My applications</h1>
          <p className="mt-1 text-sm text-naukri-muted">
            {applications.length} application{applications.length === 1 ? "" : "s"} submitted
          </p>

          <div className="mt-5 space-y-4">
            {applications.map((application) => (
              <div key={application.id} className="card flex items-start gap-4 p-4">
                <CompanyLogo
                  text={application.job.company.logoText}
                  color={application.job.company.logoColor}
                />
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/jobs/${application.job.id}`}
                    className="text-sm font-medium text-gray-900 hover:text-naukri-blue"
                  >
                    {application.job.title}
                  </Link>
                  <p className="text-sm text-naukri-muted">{application.job.company.name}</p>
                  <p className="mt-1 text-xs text-gray-500">
                    Applied {formatPostedAt(application.appliedAt)}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[application.status] ?? "bg-gray-100 text-gray-600"}`}
                >
                  {humanize(application.status)}
                </span>
              </div>
            ))}
            {applications.length === 0 ? (
              <div className="card p-10 text-center">
                <p className="text-base font-medium text-gray-900">No applications yet</p>
                <Link href="/jobs" className="btn-primary mt-4">
                  Browse jobs
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
