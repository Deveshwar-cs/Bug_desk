import {redirect} from "next/navigation";
import {getSession} from "./lib/auth-session";
import IssueList from "./components/IssueList";
import LogoutButton from "./components/LogoutButton";

export default async function Home() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Top navigation */}
      <nav className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white shadow-sm">
              B
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900">
                BugDesk
              </h1>
              <p className="text-xs text-slate-500">
                Issue management workspace
              </p>
            </div>
          </div>

          <LogoutButton />
        </div>
      </nav>

      {/* Main dashboard */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        {/* Welcome section */}
        <section className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-600 px-6 py-8 text-white shadow-sm sm:px-8 sm:py-10">
          <div className="pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full border-[32px] border-white/10" />
          <div className="pointer-events-none absolute -bottom-24 right-36 h-48 w-48 rounded-full bg-white/5" />

          <div className="relative">
            <p className="text-sm font-medium text-blue-100">YOUR WORKSPACE</p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Welcome back!
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-blue-100 sm:text-base">
              Keep track of bugs, organize tasks, and monitor progress from one
              place.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-2 text-sm">
              <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5">
                Issue tracking
              </span>
              <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5">
                Status management
              </span>
            </div>
          </div>
        </section>

        {/* Workspace content */}
        <section className="space-y-6">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                Dashboard
              </p>

              <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Manage your issues
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Create new issues and keep existing ones up to date.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:p-8">
            <IssueList />
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-10 border-t border-slate-200 py-6 text-center">
          <p className="text-sm text-slate-500">
            BugDesk · Keep your work organized.
          </p>
        </footer>
      </div>
    </main>
  );
}
