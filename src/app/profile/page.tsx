import { redirect } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProfileForm } from "./ProfileForm";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/profile");
  if (user.role === "EMPLOYER") redirect("/employer");

  const [applications, saved] = await Promise.all([
    prisma.application.count({ where: { userId: user.id } }),
    prisma.savedJob.count({ where: { userId: user.id } }),
  ]);

  return (
    <>
      <Header withSearch />
      <main className="bg-[#f7f8fc] py-8">
        <div className="container-page grid gap-5 lg:grid-cols-[1fr_280px]">
          <div className="card p-6">
            <h1 className="text-xl font-bold text-gray-900">My profile</h1>
            <p className="mt-1 mb-5 text-sm text-naukri-muted">
              A complete profile gets you 3x more recruiter views.
            </p>
            <ProfileForm
              initial={{
                name: user.name,
                phone: user.phone ?? "",
                location: user.location ?? "",
                headline: user.headline ?? "",
                experience: user.experience?.toString() ?? "",
                currentSalary: user.currentSalary?.toString() ?? "",
                skills: user.skills ?? "",
                resumeText: user.resumeText ?? "",
              }}
            />
          </div>

          <aside className="card h-fit p-5">
            <p className="text-sm font-semibold text-gray-900">Activity</p>
            <dl className="mt-3 space-y-2 text-sm text-naukri-muted">
              <div className="flex justify-between">
                <dt>Applications</dt>
                <dd className="font-medium text-gray-900">{applications}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Saved jobs</dt>
                <dd className="font-medium text-gray-900">{saved}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Email</dt>
                <dd className="truncate font-medium text-gray-900">{user.email}</dd>
              </div>
            </dl>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
