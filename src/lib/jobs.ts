import type { Prisma } from "@prisma/client";
import { prisma } from "./prisma";
import { SALARY_BUCKETS } from "./constants";

export type JobSearchParams = {
  q?: string;
  location?: string;
  experience?: string;
  workMode?: string | string[];
  department?: string | string[];
  employmentType?: string | string[];
  salary?: string | string[];
  company?: string | string[];
  postedWithin?: string;
  sort?: string;
  page?: string;
};

export const PAGE_SIZE = 10;

function toArray(value: string | string[] | undefined) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

export function buildJobWhere(params: JobSearchParams): Prisma.JobWhereInput {
  const filters: Prisma.JobWhereInput[] = [{ isActive: true }];

  if (params.q) {
    const q = params.q.trim();
    filters.push({
      OR: [
        { title: { contains: q } },
        { skills: { contains: q } },
        { role: { contains: q } },
        { department: { contains: q } },
        { description: { contains: q } },
        { company: { is: { name: { contains: q } } } },
      ],
    });
  }

  if (params.location) {
    filters.push({ locations: { contains: params.location.trim() } });
  }

  if (params.experience !== undefined && params.experience !== "") {
    const years = Number(params.experience);
    if (!Number.isNaN(years)) {
      filters.push({ minExperience: { lte: years }, maxExperience: { gte: years } });
    }
  }

  const workModes = toArray(params.workMode);
  if (workModes.length) filters.push({ workMode: { in: workModes } });

  const departments = toArray(params.department);
  if (departments.length) filters.push({ department: { in: departments } });

  const employmentTypes = toArray(params.employmentType);
  if (employmentTypes.length) filters.push({ employmentType: { in: employmentTypes } });

  const companies = toArray(params.company);
  if (companies.length) filters.push({ company: { is: { slug: { in: companies } } } });

  const salaries = toArray(params.salary);
  if (salaries.length) {
    const ranges = salaries
      .map((value) => SALARY_BUCKETS.find((bucket) => bucket.value === value))
      .filter((bucket): bucket is (typeof SALARY_BUCKETS)[number] => Boolean(bucket))
      .map((bucket) => ({ minSalary: { lte: bucket.max }, maxSalary: { gte: bucket.min } }));
    if (ranges.length) filters.push({ OR: ranges });
  }

  if (params.postedWithin) {
    const days = Number(params.postedWithin);
    if (!Number.isNaN(days)) {
      filters.push({ postedAt: { gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000) } });
    }
  }

  return { AND: filters };
}

export async function searchJobs(params: JobSearchParams) {
  const where = buildJobWhere(params);
  const page = Math.max(1, Number(params.page ?? "1") || 1);
  const orderBy: Prisma.JobOrderByWithRelationInput =
    params.sort === "salary"
      ? { maxSalary: "desc" }
      : params.sort === "experience"
        ? { minExperience: "asc" }
        : { postedAt: "desc" };

  const [total, jobs] = await Promise.all([
    prisma.job.count({ where }),
    prisma.job.findMany({
      where,
      orderBy,
      include: { company: true },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);

  return { jobs, total, page, pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}

export async function getFilterCounts() {
  const jobs = await prisma.job.findMany({
    where: { isActive: true },
    select: {
      workMode: true,
      department: true,
      employmentType: true,
      minSalary: true,
      maxSalary: true,
      company: { select: { name: true, slug: true } },
    },
  });

  const count = <T extends string>(values: T[]) => {
    const map = new Map<T, number>();
    for (const value of values) map.set(value, (map.get(value) ?? 0) + 1);
    return map;
  };

  return {
    workMode: count(jobs.map((job) => job.workMode)),
    department: count(jobs.map((job) => job.department)),
    employmentType: count(jobs.map((job) => job.employmentType)),
    company: jobs.reduce<Map<string, { name: string; count: number }>>((acc, job) => {
      const existing = acc.get(job.company.slug);
      acc.set(job.company.slug, {
        name: job.company.name,
        count: (existing?.count ?? 0) + 1,
      });
      return acc;
    }, new Map()),
    salary: new Map(
      SALARY_BUCKETS.map((bucket) => [
        bucket.value,
        jobs.filter((job) => job.minSalary <= bucket.max && job.maxSalary >= bucket.min).length,
      ]),
    ),
  };
}
