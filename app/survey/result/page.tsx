"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SurveyResult() {
  const [totalScore, setTotalScore] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    const categories = [
      "foodCategory",
      "transportCategory",
      "homeCategory",
      "consumptionCategory",
    ];
    let total = 0;
    let count = 0;

    categories.forEach((key) => {
      const data = localStorage.getItem(key);
      if (data) {
        const answers = JSON.parse(data);
        total += answers.reduce((sum: number, v: number) => sum + v, 0);
        count += answers.length;
      }
    });

    const normalized = count ? total / count : 0;
    const footprint = Math.round((6 - normalized) * 20); // lower = better
    setTotalScore(footprint);
    
    // Store score in sessionStorage for saving after login
    sessionStorage.setItem("pendingScore", footprint.toString());
  }, []);

  return (
    <section className="flex flex-col items-center justify-center text-center gap-6">
      <h2 className="text-3xl font-bold text-[var(--accent)] mb-4">
        Your Footprint Score
      </h2>
      <div className="text-6xl font-bold text-[var(--accent)] mb-4">
        {totalScore}
      </div>
      <p className="max-w-md text-gray-700 mb-6">
        A lower score indicates a smaller environmental footprint. Explore each
        category to see where improvements can be made.
      </p>
      
      <div className="flex flex-col gap-4 items-center">
        <p className="text-lg font-semibold text-[var(--foreground)]">
          Save your results to track your progress over time!
        </p>
        <div className="flex gap-4">
          <Link
            href="/auth/signin"
            className="px-6 py-3 rounded-md bg-[var(--accent)] text-white hover:opacity-90 transition font-semibold"
          >
            Sign In to Save
          </Link>
          <Link
            href="/auth/signup"
            className="px-6 py-3 rounded-md border-2 border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white transition font-semibold"
          >
            Create Account
          </Link>
        </div>
        <Link
          href="/"
          className="text-sm text-gray-600 hover:text-[var(--accent)] transition"
        >
          Continue without saving
        </Link>
      </div>
    </section>
  );
}
