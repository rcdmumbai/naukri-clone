import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { RegisterForm } from "./RegisterForm";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function RegisterPage() {
  if (await getSession()) redirect("/jobs");

  return (
    <>
      <Header />
      <main className="bg-[#f7f8fc] py-12">
        <div className="container-page max-w-xl">
          <div className="card p-6">
            <h1 className="text-xl font-bold text-gray-900">Create your profile</h1>
            <p className="mt-1 text-sm text-naukri-muted">
              Search and apply to jobs from India&apos;s leading companies.
            </p>
            <Suspense fallback={null}>
              <RegisterForm />
            </Suspense>
            <p className="mt-4 text-sm text-naukri-muted">
              Already registered?{" "}
              <Link href="/login" className="font-medium text-naukri-blue">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
