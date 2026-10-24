import Link from "next/link";
import { Briefcase, IndianRupee, MapPin, Star } from "lucide-react";
import type { Company, Job } from "@prisma/client";
import { CompanyLogo } from "./CompanyLogo";
import { SaveJobButton } from "./SaveJobButton";
import { formatExperience, formatPostedAt, formatSalary, splitList } from "@/lib/format";

type Props = {
  job: Job & { company: Company };
  saved?: boolean;
  isAuthenticated?: boolean;
};

export function JobCard({ job, saved = false, isAuthenticated = false }: Props) {
  const locations = splitList(job.locations);
  const skills = splitList(job.skills);

  return (
    <article className="card p-4 transition hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <Link href={`/jobs/${job.id}`} className="text-base font-medium text-gray-900 hover:text-naukri-blue">
            {job.title}
          </Link>
          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-naukri-muted">
            <Link href={`/companies/${job.company.slug}`} className="hover:text-naukri-blue">
              {job.company.name}
            </Link>
            <span className="inline-flex items-center gap-1 text-xs">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              {job.company.rating.toFixed(1)}
            </span>
            <span className="text-xs text-gray-400">{job.company.reviews.toLocaleString("en-IN")} Reviews</span>
          </div>
        </div>
        <CompanyLogo text={job.company.logoText} color={job.company.logoColor} />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-naukri-muted">
        <span className="inline-flex items-center gap-1.5">
          <Briefcase className="h-4 w-4" />
          {formatExperience(job.minExperience, job.maxExperience)}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <IndianRupee className="h-4 w-4" />
          {formatSalary(job.minSalary, job.maxSalary)}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="h-4 w-4" />
          {locations.slice(0, 3).join(", ")}
        </span>
      </div>

      <p className="mt-3 line-clamp-2 text-sm text-naukri-muted">{job.description}</p>

      <div className="mt-3 flex flex-wrap gap-2">
        {skills.slice(0, 6).map((skill) => (
          <span key={skill} className="chip">
            {skill}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
        <span className="text-xs text-gray-500">{formatPostedAt(job.postedAt)}</span>
        <SaveJobButton jobId={job.id} initialSaved={saved} isAuthenticated={isAuthenticated} />
      </div>
    </article>
  );
}
