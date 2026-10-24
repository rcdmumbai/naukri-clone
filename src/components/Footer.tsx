import Link from "next/link";

const columns = [
  {
    title: "Jobseekers",
    links: [
      { label: "Search jobs", href: "/jobs" },
      { label: "Remote jobs", href: "/jobs?workMode=REMOTE" },
      { label: "Fresher jobs", href: "/jobs?experience=0" },
      { label: "Internships", href: "/jobs?employmentType=INTERNSHIP" },
    ],
  },
  {
    title: "Companies",
    links: [
      { label: "Browse companies", href: "/companies" },
      { label: "IT services", href: "/jobs?department=Engineering+-+Software+%26+QA" },
      { label: "Banking", href: "/jobs?department=BFSI%2C+Investments+%26+Trading" },
      { label: "Consulting", href: "/jobs?department=Consulting" },
    ],
  },
  {
    title: "Employers",
    links: [
      { label: "Employer dashboard", href: "/employer" },
      { label: "Post a job", href: "/employer/jobs/new" },
      { label: "Register as employer", href: "/register?role=employer" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About us", href: "/services" },
      { label: "Careers", href: "/jobs" },
      { label: "Help centre", href: "/services" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-200 bg-gray-50">
      <div className="container-page grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
        {columns.map((column) => (
          <div key={column.title}>
            <h3 className="mb-3 text-sm font-semibold text-gray-900">{column.title}</h3>
            <ul className="space-y-2">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-gray-600 hover:text-naukri-blue">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-gray-200 py-4">
        <p className="container-page text-xs text-gray-500">
          Naukri Clone — an educational replica built for demonstration purposes. Not affiliated with
          Naukri.com or Info Edge (India) Ltd.
        </p>
      </div>
    </footer>
  );
}
