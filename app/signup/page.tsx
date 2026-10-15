"use client";

import {useEffect, useState} from "react";
import {authClient} from "../lib/auth-client";
import {useRouter} from "next/navigation";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const {data: session, isPending} = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.replace("/");
    }
  }, [session, router]);

  if (isPending || session) {
    return <p className="p-6">Checking session...</p>;
  }
  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const {error} = await authClient.signUp.email({
        name,
        email,
        password,
      });

      if (error) {
        setMessage(error.message ?? "Registration failed.");
        return;
      }

      setMessage("Account created successfully!");
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <main className="mx-auto mt-16 max-w-md p-6">
      <h1 className="mb-6 text-2xl font-bold">Create your BugDesk account</h1>

      <form onSubmit={handleSignup} className="space-y-4">
        <input
          className="w-full rounded border p-3"
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

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
          placeholder="Password (minimum 8 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={8}
          required
        />

        <button
          className="w-full rounded bg-blue-600 p-3 text-white disabled:opacity-50"
          type="submit"
          disabled={loading}
        >
          {loading ? "Creating account..." : "Sign up"}
        </button>

        {message && <p role="status">{message}</p>}
      </form>
    </main>
  );
}
