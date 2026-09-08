import { redirect } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PostJobForm } from "./PostJobForm";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function NewJobPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/employer/jobs/new");
  if (user.role !== "EMPLOYER") redirect("/jobs");

  return (
    <>
      <Header />
      <main className="bg-[#f7f8fc] py-8">
        <div className="container-page max-w-3xl">
          <div className="card p-6">
            <h1 className="text-xl font-bold text-gray-900">Post a job</h1>
            <p className="mt-1 mb-5 text-sm text-naukri-muted">
              Posting as {user.company?.name ?? "your company"}.
            </p>
            <PostJobForm />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
