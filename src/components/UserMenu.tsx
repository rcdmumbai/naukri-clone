"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

type Props = {
  name: string;
  role: "JOBSEEKER" | "EMPLOYER";
};

export function UserMenu({ name, role }: Props) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  const links =
    role === "EMPLOYER"
      ? [
          { href: "/employer", label: "Employer dashboard" },
          { href: "/employer/jobs/new", label: "Post a job" },
        ]
      : [
          { href: "/profile", label: "My profile" },
          { href: "/applications", label: "My applications" },
          { href: "/saved", label: "Saved jobs" },
        ];

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-2 text-sm font-medium text-gray-700"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-naukri-blue text-xs font-semibold text-white">
          {name.slice(0, 1).toUpperCase()}
        </span>
        <span className="hidden md:inline">{name.split(" ")[0]}</span>
        <ChevronDown className="h-4 w-4" />
      </button>
      {open ? (
        <div className="absolute right-0 z-30 mt-2 w-52 rounded-lg border border-gray-200 bg-white py-2 shadow-lg">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              {link.label}
            </Link>
          ))}
          <button
            type="button"
            onClick={logout}
            className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
          >
            Logout
          </button>
        </div>
      ) : null}
    </div>
  );
}
