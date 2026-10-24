import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const services = [
  {
    title: "Resume writing",
    description: "Get a recruiter-ready resume crafted by industry experts within 5 working days.",
  },
  {
    title: "Profile highlighter",
    description: "Stand out in recruiter searches and get up to 3x more profile views.",
  },
  {
    title: "Priority applicant",
    description: "Be among the first applications a recruiter sees for every job you apply to.",
  },
  {
    title: "Career guidance",
    description: "One-on-one sessions with mentors to plan your next career move.",
  },
];

export default function ServicesPage() {
  return (
    <>
      <Header />
      <main className="bg-[#f7f8fc] py-10">
        <div className="container-page">
          <h1 className="text-xl font-bold text-gray-900">Career services</h1>
          <p className="mt-1 text-sm text-naukri-muted">
            Accelerate your job search with paid services from Naukri Clone.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {services.map((service) => (
              <div key={service.title} className="card p-5">
                <h2 className="text-sm font-semibold text-gray-900">{service.title}</h2>
                <p className="mt-2 text-sm text-naukri-muted">{service.description}</p>
                <Link href="/jobs" className="btn-outline mt-4">
                  Know more
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
