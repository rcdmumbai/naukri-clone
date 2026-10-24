import Link from "next/link";
import { Suspense } from "react";
import { getSession } from "@/lib/auth";
import { Logo } from "./Logo";
import { SearchBar } from "./SearchBar";
import { UserMenu } from "./UserMenu";

type Props = {
  withSearch?: boolean;
};

export async function Header({ withSearch = false }: Props) {
  const session = await getSession();

  return (
    <header className="sticky top-0 z-20 border-b border-gray-200 bg-white">
      <div className="container-page flex h-16 items-center gap-6">
        <Logo />
        <nav className="hidden items-center gap-6 text-sm font-medium text-gray-700 md:flex">
          <Link href="/jobs" className="hover:text-naukri-blue">
            Jobs
          </Link>
          <Link href="/companies" className="hover:text-naukri-blue">
            Companies
          </Link>
          <Link href="/services" className="hover:text-naukri-blue">
            Services
          </Link>
        </nav>
        {withSearch ? (
          <div className="hidden flex-1 justify-center md:flex">
            <Suspense fallback={null}>
              <SearchBar variant="compact" />
            </Suspense>
          </div>
        ) : (
          <div className="flex-1" />
        )}
        <div className="flex items-center gap-3">
          {session ? (
            <UserMenu name={session.name} role={session.role} />
          ) : (
            <>
              <Link href="/login" className="btn-outline hidden sm:inline-flex">
                Login
              </Link>
              <Link href="/register" className="btn-primary">
                Register
              </Link>
              <Link
                href="/employer"
                className="hidden text-sm font-medium text-gray-700 hover:text-naukri-blue lg:inline"
              >
                For employers
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
