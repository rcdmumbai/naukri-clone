import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2 ${className}`}>
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-naukri-blue text-white">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M14 6 8 12l6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className="text-2xl font-bold lowercase tracking-tight text-naukri-blue">naukri</span>
    </Link>
  );
}
