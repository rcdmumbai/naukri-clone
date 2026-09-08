export const WORK_MODES = [
  { value: "WORK_FROM_OFFICE", label: "Work from office" },
  { value: "HYBRID", label: "Hybrid" },
  { value: "REMOTE", label: "Remote" },
] as const;

export const EMPLOYMENT_TYPES = [
  { value: "FULL_TIME", label: "Full time" },
  { value: "PART_TIME", label: "Part time" },
  { value: "INTERNSHIP", label: "Internship" },
  { value: "CONTRACT", label: "Contract" },
] as const;

export const DEPARTMENTS = [
  "Engineering - Software & QA",
  "Data Science & Analytics",
  "IT & Information Security",
  "Engineering - Hardware & Networks",
  "Product Management",
  "UX, Design & Architecture",
  "Sales & Business Development",
  "Marketing & Communication",
  "BFSI, Investments & Trading",
  "Consulting",
  "Customer Success & Support",
];

export const SALARY_BUCKETS = [
  { value: "0-3", label: "0-3 Lakhs", min: 0, max: 3 },
  { value: "3-6", label: "3-6 Lakhs", min: 3, max: 6 },
  { value: "6-10", label: "6-10 Lakhs", min: 6, max: 10 },
  { value: "10-15", label: "10-15 Lakhs", min: 10, max: 15 },
  { value: "15-25", label: "15-25 Lakhs", min: 15, max: 25 },
  { value: "25-50", label: "25-50 Lakhs", min: 25, max: 50 },
  { value: "50-1000", label: "50+ Lakhs", min: 50, max: 1000 },
];

export const POSTED_WITHIN = [
  { value: "1", label: "Last 1 day" },
  { value: "3", label: "Last 3 days" },
  { value: "7", label: "Last 7 days" },
  { value: "15", label: "Last 15 days" },
  { value: "30", label: "Last 30 days" },
];

export const APPLICATION_STATUSES = ["APPLIED", "SHORTLISTED", "REJECTED", "HIRED"] as const;

export const EXPERIENCE_OPTIONS = Array.from({ length: 31 }, (_, index) => index);

export const POPULAR_CATEGORIES = [
  { label: "Remote", query: "workMode=REMOTE", icon: "home" },
  { label: "MNC", query: "q=MNC", icon: "building" },
  { label: "Supply Chain", query: "q=supply%20chain", icon: "truck" },
  { label: "Fresher", query: "experience=0", icon: "graduation" },
  { label: "Software & IT", query: "department=Engineering%20-%20Software%20%26%20QA", icon: "code" },
  { label: "Analytics", query: "department=Data%20Science%20%26%20Analytics", icon: "chart" },
  { label: "Data Science", query: "q=data%20science", icon: "database" },
  { label: "Startup", query: "q=startup", icon: "rocket" },
  { label: "Internship", query: "employmentType=INTERNSHIP", icon: "briefcase" },
  { label: "Sales", query: "department=Sales%20%26%20Business%20Development", icon: "trending" },
  { label: "Marketing", query: "department=Marketing%20%26%20Communication", icon: "megaphone" },
];
