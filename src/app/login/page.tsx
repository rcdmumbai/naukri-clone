import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LoginForm } from "./LoginForm";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (await getSession()) redirect("/jobs");

  return (
    <>
      <Header />
      <main className="bg-[#f7f8fc] py-12">
        <div className="container-page max-w-md">
          <div className="card p-6">
            <h1 className="text-xl font-bold text-gray-900">Login</h1>
            <p className="mt-1 text-sm text-naukri-muted">
              Continue your job search or manage your hiring.
            </p>
            <Suspense fallback={null}>
              <LoginForm />
            </Suspense>
            <p className="mt-4 text-sm text-naukri-muted">
              New to Naukri Clone?{" "}
              <Link href="/register" className="font-medium text-naukri-blue">
                Register for free
              </Link>
            </p>
            <div className="mt-4 rounded-md bg-blue-50 p-3 text-xs text-naukri-blue">
              <p className="font-semibold">Demo accounts</p>
              <p>jobseeker@example.com / Password@123</p>
              <p>employer@example.com / Password@123</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
