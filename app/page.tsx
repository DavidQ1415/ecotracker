import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[var(--background)] text-[var(--foreground)]">
      <h1 className="text-4xl font-bold mb-4 text-[var(--accent)]">EcoTrack</h1>
      <p className="text-lg mb-6 text-[var(--foreground)]">
        Track your sustainability journey with ease.
      </p>

      <div className="flex flex-col gap-4">
        <Link
          href="/survey/consumption"
          className="px-6 py-3 rounded-md bg-[var(--accent)] text-white hover:opacity-90 transition"
        >
          Get Started
        </Link>
        <Link
          href="/auth/signin"
          className="px-6 py-3 rounded-md bg-[var(--accent)] text-white hover:opacity-90 transition"
        >
          Login
        </Link>
      </div>
    </main>
  );
}
