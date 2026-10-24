import Link from "next/link";
import { redirect } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JobCard } from "@/components/JobCard";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function SavedJobsPage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/saved");

  const saved = await prisma.savedJob.findMany({
    where: { userId: session.userId },
    include: { job: { include: { company: true } } },
    orderBy: { savedAt: "desc" },
  });

  return (
    <>
      <Header withSearch />
      <main className="bg-[#f7f8fc] py-8">
        <div className="container-page">
          <h1 className="text-xl font-bold text-gray-900">Saved jobs</h1>
          <p className="mt-1 text-sm text-naukri-muted">{saved.length} saved</p>

          <div className="mt-5 space-y-4">
            {saved.map((item) => (
              <JobCard key={item.id} job={item.job} saved isAuthenticated />
            ))}
            {saved.length === 0 ? (
              <div className="card p-10 text-center">
                <p className="text-base font-medium text-gray-900">You have not saved any jobs</p>
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
