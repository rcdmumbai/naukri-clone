import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const companies = [
  { name: "Tata Consultancy Services", industry: "IT Services & Consulting", logoText: "TCS", logoColor: "#1a3d8f", rating: 3.7, reviews: 117891, size: "1 Lakh+ employees", description: "TCS is an IT services, consulting and business solutions organisation that has been partnering with many of the world's largest businesses for over 50 years." },
  { name: "Infosys", industry: "IT Services & Consulting", logoText: "INFY", logoColor: "#007cc3", rating: 3.6, reviews: 95210, size: "1 Lakh+ employees", description: "Infosys is a global leader in next-generation digital services and consulting, enabling clients in 56 countries to navigate their digital transformation." },
  { name: "Capgemini", industry: "IT Services & Consulting", logoText: "CG", logoColor: "#0070ad", rating: 3.6, reviews: 55436, size: "1 Lakh+ employees", description: "Capgemini is a global leader in partnering with companies to transform and manage their business by harnessing the power of technology." },
  { name: "Coforge", industry: "IT Services & Consulting", logoText: "CF", logoColor: "#e4002b", rating: 3.3, reviews: 9200, size: "10k-50k employees", description: "Global digital services and solutions provider delivering domain expertise across banking, insurance and travel." },
  { name: "Reliance Retail", industry: "Retail", logoText: "RR", logoColor: "#003087", rating: 3.9, reviews: 28000, size: "1 Lakh+ employees", description: "Building India's largest retail company across grocery, consumer electronics, fashion and lifestyle." },
  { name: "Siemens", industry: "Industrial Automation", logoText: "SIE", logoColor: "#009999", rating: 4.0, reviews: 6000, size: "50k-1 Lakh employees", description: "Create a better #TomorrowWithUs. Siemens focuses on intelligent infrastructure, automation and digitalisation." },
  { name: "Nagarro", industry: "Software Product", logoText: "NG", logoColor: "#12b886", rating: 3.9, reviews: 4900, size: "10k-50k employees", description: "Leader in digital product engineering with a caring, non-hierarchical and entrepreneurial culture." },
  { name: "Amazon", industry: "Internet / E-commerce", logoText: "AMZ", logoColor: "#ff9900", rating: 4.1, reviews: 32000, size: "1 Lakh+ employees", description: "Earth's most customer-centric company, building products and services across e-commerce, cloud and devices." },
  { name: "Flipkart", industry: "Internet / E-commerce", logoText: "FK", logoColor: "#2874f0", rating: 4.0, reviews: 5400, size: "10k-50k employees", description: "India's homegrown e-commerce marketplace serving 500 million customers." },
  { name: "HDFC Bank", industry: "Banking & Financial Services", logoText: "HDFC", logoColor: "#004c8f", rating: 3.9, reviews: 39000, size: "1 Lakh+ employees", description: "India's leading private sector bank offering a wide range of banking and financial services." },
  { name: "Zomato", industry: "Internet / Food Tech", logoText: "ZOM", logoColor: "#e23744", rating: 3.8, reviews: 4100, size: "5k-10k employees", description: "Food delivery and restaurant discovery platform operating across 800+ Indian cities." },
  { name: "Deloitte", industry: "Management Consulting", logoText: "DEL", logoColor: "#86bc25", rating: 3.9, reviews: 51000, size: "1 Lakh+ employees", description: "Audit, consulting, tax and advisory services helping clients tackle their most complex challenges." },
];

type JobSeed = {
  title: string;
  company: string;
  role: string;
  department: string;
  locations: string;
  skills: string;
  minExperience: number;
  maxExperience: number;
  minSalary: number;
  maxSalary: number;
  workMode: string;
  employmentType: string;
  openings: number;
  description: string;
  daysAgo: number;
};

const jobs: JobSeed[] = [
  {
    title: "Software Engineer - Ecommerce Search",
    company: "Tata Consultancy Services",
    role: "Software Development Engineer",
    department: "Engineering - Software & QA",
    locations: "Hyderabad,Chennai,Bengaluru",
    skills: "Java,Elasticsearch,Solr,Lucene,CI/CD,Microservices",
    minExperience: 6,
    maxExperience: 10,
    minSalary: 18,
    maxSalary: 30,
    workMode: "HYBRID",
    employmentType: "FULL_TIME",
    openings: 12,
    daysAgo: 4,
    description:
      "Design and build large scale ecommerce search platforms. You will own relevance tuning, indexing pipelines and query understanding for a catalogue of 100M+ products.",
  },
  {
    title: "Software Engineer",
    company: "Capgemini",
    role: "Software Development Engineer",
    department: "Engineering - Software & QA",
    locations: "Bengaluru,Pune",
    skills: "Java,Spring Boot,SQL,REST API,Software Development",
    minExperience: 0,
    maxExperience: 5,
    minSalary: 4,
    maxSalary: 12,
    workMode: "WORK_FROM_OFFICE",
    employmentType: "FULL_TIME",
    openings: 40,
    daysAgo: 3,
    description:
      "The software engineer collaborates and acts as a team player with other software engineers to deliver enterprise grade applications for global clients.",
  },
  {
    title: "Frontend Developer - React",
    company: "Flipkart",
    role: "Frontend Developer",
    department: "Engineering - Software & QA",
    locations: "Bengaluru",
    skills: "React,TypeScript,Next.js,CSS,Redux,Performance",
    minExperience: 2,
    maxExperience: 6,
    minSalary: 18,
    maxSalary: 38,
    workMode: "HYBRID",
    employmentType: "FULL_TIME",
    openings: 5,
    daysAgo: 1,
    description:
      "Build delightful, blazing fast shopping experiences used by 500 million customers. Own end to end delivery of features on the Flipkart web platform.",
  },
  {
    title: "Senior Data Scientist",
    company: "Amazon",
    role: "Data Scientist",
    department: "Data Science & Analytics",
    locations: "Bengaluru,Hyderabad",
    skills: "Python,Machine Learning,SQL,Deep Learning,Statistics,AWS",
    minExperience: 5,
    maxExperience: 9,
    minSalary: 35,
    maxSalary: 60,
    workMode: "WORK_FROM_OFFICE",
    employmentType: "FULL_TIME",
    openings: 3,
    daysAgo: 2,
    description:
      "Apply machine learning to demand forecasting and pricing problems at Amazon scale. Partner with product and engineering to ship models into production.",
  },
  {
    title: "DevOps Engineer",
    company: "Nagarro",
    role: "DevOps Engineer",
    department: "IT & Information Security",
    locations: "Gurugram,Remote",
    skills: "Kubernetes,Docker,Terraform,AWS,Jenkins,Linux",
    minExperience: 3,
    maxExperience: 7,
    minSalary: 12,
    maxSalary: 26,
    workMode: "REMOTE",
    employmentType: "FULL_TIME",
    openings: 8,
    daysAgo: 6,
    description:
      "Automate build, release and infrastructure provisioning for cloud native products. Champion observability and reliability practices across teams.",
  },
  {
    title: "Java Backend Developer",
    company: "Infosys",
    role: "Backend Developer",
    department: "Engineering - Software & QA",
    locations: "Pune,Hyderabad,Chennai",
    skills: "Java,Spring Boot,Microservices,Kafka,PostgreSQL",
    minExperience: 3,
    maxExperience: 8,
    minSalary: 9,
    maxSalary: 22,
    workMode: "HYBRID",
    employmentType: "FULL_TIME",
    openings: 25,
    daysAgo: 5,
    description:
      "Develop resilient backend services for banking clients. Work across the full lifecycle from design and coding to deployment and production support.",
  },
  {
    title: "Product Manager - Payments",
    company: "HDFC Bank",
    role: "Product Manager",
    department: "Product Management",
    locations: "Mumbai",
    skills: "Product Management,Payments,Analytics,Stakeholder Management,Roadmap",
    minExperience: 6,
    maxExperience: 11,
    minSalary: 30,
    maxSalary: 55,
    workMode: "WORK_FROM_OFFICE",
    employmentType: "FULL_TIME",
    openings: 2,
    daysAgo: 8,
    description:
      "Own the digital payments product line - UPI, cards and merchant acquiring. Define the roadmap and work with engineering, risk and compliance to deliver.",
  },
  {
    title: "QA Automation Engineer",
    company: "Coforge",
    role: "QA / Test Engineer",
    department: "Engineering - Software & QA",
    locations: "Noida,Greater Noida",
    skills: "Selenium,Java,TestNG,API Testing,Cypress",
    minExperience: 2,
    maxExperience: 5,
    minSalary: 6,
    maxSalary: 14,
    workMode: "WORK_FROM_OFFICE",
    employmentType: "FULL_TIME",
    openings: 10,
    daysAgo: 9,
    description:
      "Build and maintain automation suites for web and API layers. Drive shift-left quality practices within agile delivery squads.",
  },
  {
    title: "UI/UX Designer",
    company: "Zomato",
    role: "Product Designer",
    department: "UX, Design & Architecture",
    locations: "Gurugram,Remote",
    skills: "Figma,User Research,Prototyping,Design Systems,Interaction Design",
    minExperience: 2,
    maxExperience: 6,
    minSalary: 14,
    maxSalary: 30,
    workMode: "REMOTE",
    employmentType: "FULL_TIME",
    openings: 2,
    daysAgo: 3,
    description:
      "Craft simple, delightful ordering journeys for millions of users. Partner with PMs and engineers from problem framing to pixel-perfect delivery.",
  },
  {
    title: "Business Analyst",
    company: "Deloitte",
    role: "Business Analyst",
    department: "Consulting",
    locations: "Bengaluru,Mumbai,Gurugram",
    skills: "Business Analysis,SQL,Excel,Stakeholder Management,Requirement Gathering",
    minExperience: 1,
    maxExperience: 4,
    minSalary: 7,
    maxSalary: 16,
    workMode: "HYBRID",
    employmentType: "FULL_TIME",
    openings: 15,
    daysAgo: 2,
    description:
      "Work with global clients to translate business problems into structured requirements, process flows and measurable outcomes.",
  },
  {
    title: "Store Manager",
    company: "Reliance Retail",
    role: "Retail Store Manager",
    department: "Sales & Business Development",
    locations: "Mumbai,Thane,Navi Mumbai",
    skills: "Retail Operations,Team Management,Sales,Inventory Management",
    minExperience: 4,
    maxExperience: 9,
    minSalary: 6,
    maxSalary: 12,
    workMode: "WORK_FROM_OFFICE",
    employmentType: "FULL_TIME",
    openings: 20,
    daysAgo: 11,
    description:
      "Run a flagship retail store end to end - sales targets, shrinkage control, staffing and customer experience.",
  },
  {
    title: "Automation Engineer - PLC",
    company: "Siemens",
    role: "Automation Engineer",
    department: "Engineering - Hardware & Networks",
    locations: "Pune,Chennai",
    skills: "PLC,SCADA,TIA Portal,Commissioning,Industrial Automation",
    minExperience: 3,
    maxExperience: 8,
    minSalary: 8,
    maxSalary: 18,
    workMode: "WORK_FROM_OFFICE",
    employmentType: "FULL_TIME",
    openings: 6,
    daysAgo: 7,
    description:
      "Design, program and commission industrial automation systems for manufacturing customers across India.",
  },
  {
    title: "Software Development Intern",
    company: "Nagarro",
    role: "Intern",
    department: "Engineering - Software & QA",
    locations: "Remote",
    skills: "JavaScript,React,Git,Problem Solving",
    minExperience: 0,
    maxExperience: 1,
    minSalary: 3,
    maxSalary: 5,
    workMode: "REMOTE",
    employmentType: "INTERNSHIP",
    openings: 30,
    daysAgo: 1,
    description:
      "Six month internship for final year students. Work on real product features with a mentor and convert to a full time offer based on performance.",
  },
  {
    title: "Cloud Architect",
    company: "Infosys",
    role: "Solution Architect",
    department: "IT & Information Security",
    locations: "Bengaluru,Hyderabad,Remote",
    skills: "AWS,Azure,Solution Architecture,Kubernetes,Security,Cost Optimization",
    minExperience: 8,
    maxExperience: 14,
    minSalary: 30,
    maxSalary: 55,
    workMode: "HYBRID",
    employmentType: "FULL_TIME",
    openings: 4,
    daysAgo: 12,
    description:
      "Define cloud reference architectures and lead large migration programmes for Fortune 500 enterprises.",
  },
  {
    title: "Digital Marketing Manager",
    company: "Zomato",
    role: "Marketing Manager",
    department: "Marketing & Communication",
    locations: "Gurugram,Bengaluru",
    skills: "SEO,Performance Marketing,Google Ads,Analytics,Content Strategy",
    minExperience: 4,
    maxExperience: 8,
    minSalary: 15,
    maxSalary: 28,
    workMode: "HYBRID",
    employmentType: "FULL_TIME",
    openings: 2,
    daysAgo: 5,
    description:
      "Own growth channels across paid, organic and lifecycle marketing. Optimise CAC while scaling new user acquisition.",
  },
  {
    title: "Machine Learning Engineer",
    company: "Amazon",
    role: "Machine Learning Engineer",
    department: "Data Science & Analytics",
    locations: "Bengaluru,Remote",
    skills: "Python,PyTorch,MLOps,SageMaker,NLP,Distributed Training",
    minExperience: 3,
    maxExperience: 7,
    minSalary: 28,
    maxSalary: 50,
    workMode: "REMOTE",
    employmentType: "FULL_TIME",
    openings: 6,
    daysAgo: 2,
    description:
      "Ship production ML systems for recommendations and search ranking. Own the model lifecycle from data to deployment and monitoring.",
  },
  {
    title: "Full Stack Developer",
    company: "Coforge",
    role: "Full Stack Developer",
    department: "Engineering - Software & QA",
    locations: "Noida,Pune,Remote",
    skills: "Node.js,React,MongoDB,TypeScript,AWS",
    minExperience: 2,
    maxExperience: 6,
    minSalary: 8,
    maxSalary: 20,
    workMode: "REMOTE",
    employmentType: "FULL_TIME",
    openings: 9,
    daysAgo: 4,
    description:
      "Build modern web applications end to end for insurance and travel clients using the MERN stack.",
  },
  {
    title: "Relationship Manager - Corporate Banking",
    company: "HDFC Bank",
    role: "Relationship Manager",
    department: "BFSI, Investments & Trading",
    locations: "Mumbai,Delhi,Ahmedabad",
    skills: "Corporate Banking,Credit Analysis,Client Relationship,Sales",
    minExperience: 3,
    maxExperience: 8,
    minSalary: 10,
    maxSalary: 20,
    workMode: "WORK_FROM_OFFICE",
    employmentType: "FULL_TIME",
    openings: 14,
    daysAgo: 6,
    description:
      "Manage a portfolio of corporate clients, grow the book profitably and coordinate with credit and operations teams.",
  },
  {
    title: "Android Developer",
    company: "Flipkart",
    role: "Mobile Developer",
    department: "Engineering - Software & QA",
    locations: "Bengaluru",
    skills: "Kotlin,Android,Jetpack Compose,MVVM,Performance",
    minExperience: 3,
    maxExperience: 8,
    minSalary: 22,
    maxSalary: 45,
    workMode: "HYBRID",
    employmentType: "FULL_TIME",
    openings: 4,
    daysAgo: 3,
    description:
      "Own major surfaces of the Flipkart Android app. Drive app performance, stability and new shopping experiences.",
  },
  {
    title: "Technical Support Engineer",
    company: "Tata Consultancy Services",
    role: "Support Engineer",
    department: "Customer Success & Support",
    locations: "Kolkata,Chennai",
    skills: "Troubleshooting,SQL,ITIL,Incident Management,Communication",
    minExperience: 1,
    maxExperience: 4,
    minSalary: 3.5,
    maxSalary: 8,
    workMode: "WORK_FROM_OFFICE",
    employmentType: "FULL_TIME",
    openings: 35,
    daysAgo: 10,
    description:
      "Provide L1/L2 support for enterprise applications, triage incidents and coordinate resolution with engineering teams.",
  },
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function main() {
  await prisma.savedJob.deleteMany();
  await prisma.application.deleteMany();
  await prisma.job.deleteMany();
  await prisma.user.deleteMany();
  await prisma.company.deleteMany();

  const companyByName = new Map<string, string>();
  for (const company of companies) {
    const created = await prisma.company.create({
      data: {
        ...company,
        slug: slugify(company.name),
        website: `https://www.${slugify(company.name)}.com`,
      },
    });
    companyByName.set(company.name, created.id);
  }

  const passwordHash = await bcrypt.hash("Password@123", 10);

  const seeker = await prisma.user.create({
    data: {
      email: "jobseeker@example.com",
      passwordHash,
      name: "Ritesh Kumar",
      role: "JOBSEEKER",
      phone: "9876543210",
      location: "Bengaluru",
      headline: "Senior Software Engineer at a product company",
      experience: 5,
      currentSalary: 24,
      skills: "React,TypeScript,Node.js,AWS,System Design",
      resumeText:
        "Senior software engineer with 5 years of experience building consumer scale web products.",
    },
  });

  const employer = await prisma.user.create({
    data: {
      email: "employer@example.com",
      passwordHash,
      name: "Priya Sharma",
      role: "EMPLOYER",
      phone: "9876500000",
      location: "Bengaluru",
      headline: "Talent Acquisition Lead",
      companyId: companyByName.get("Flipkart"),
    },
  });

  const createdJobs = [];
  for (const job of jobs) {
    const companyId = companyByName.get(job.company);
    if (!companyId) continue;
    const { company, daysAgo, ...rest } = job;
    createdJobs.push(
      await prisma.job.create({
        data: {
          ...rest,
          companyId,
          postedById: company === "Flipkart" ? employer.id : null,
          postedAt: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
        },
      }),
    );
  }

  await prisma.application.create({
    data: { jobId: createdJobs[2].id, userId: seeker.id, status: "SHORTLISTED" },
  });
  await prisma.savedJob.create({ data: { jobId: createdJobs[3].id, userId: seeker.id } });

  console.log(
    `Seeded ${companies.length} companies, ${createdJobs.length} jobs and 2 demo users.`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
