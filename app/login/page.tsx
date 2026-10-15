"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {authClient} from "../lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const {error} = await authClient.signIn.email({
        email,
        password,
      });
      if (error) {
        setMessage(error.message ?? "Login failed.");
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setMessage("Something went wrong. Please try again");
    } finally {
      setLoading(false);
    }
  }
  return (
    <main className="mx-auto mt-16 max-w-md p-6">
      <h1 className="mb-6 text-2xl font-bold">Log in to BugDesk</h1>

      <form onSubmit={handleLogin} className="space-y-4">
        <input
          className="w-full rounded border p-3"
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          className="w-full rounded border p-3"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          className="w-full rounded bg-blue-600 p-3 text-white disabled:opacity-50"
          type="submit"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Log in"}
        </button>

        {message && <p role="status">{message}</p>}
      </form>
    </main>
  );
}
