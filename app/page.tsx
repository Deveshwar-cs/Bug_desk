import IssueList from "./components/IssueList";
import {redirect} from "next/navigation";
import {getSession} from "./lib/auth-session";
import LogoutButton from "./components/LogoutButton";

export default async function Home() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  return (
    <main className="mx-auto max-w-3xl space-y-6 p-8">
      <header>
        <h1 className="text-3xl font-bold">BugDesk</h1>
        <p className="mt-2 text-gray-600">Track and manage your issues.</p>
        <div className="mt-4">
          <LogoutButton />
        </div>
      </header>

      <section>
        <h2 className="mb-4 text-xl font-semibold">All Issues</h2>

        <IssueList />
      </section>
    </main>
  );
}
