"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {authClient} from "../lib/auth-client";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleLogout() {
    setLoading(true);
    setMessage("");

    try {
      const {error} = await authClient.signOut();

      if (error) {
        setMessage(error.message ?? "Logout failed.");
        return;
      }

      router.replace("login");
      router.refresh();
    } catch {
      setMessage("Something went wrong while logging out.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleLogout}
        disabled={loading}
        className="rounded bg-red-600 px-4 py-2 text-white disabled:opacity-50"
      >
        {loading ? "Logging out..." : "Log out"}
      </button>

      {message && <p role="status">{message}</p>}
    </div>
  );
}
