"use client";

import { useEffect, useState } from "react";

export default function SurveyResult() {
  const [totalScore, setTotalScore] = useState<number>(0);

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
  }, []);

  return (
    <section className="flex flex-col items-center justify-center text-center">
      <h2 className="text-3xl font-bold text-[var(--accent)] mb-4">
        Your Footprint Score
      </h2>
      <p className="text-lg mb-6">
        Estimated sustainability footprint:{" "}
        <span className="font-semibold">{totalScore}</span>
      </p>
      <p className="max-w-md text-gray-700">
        A lower score indicates a smaller environmental footprint. Explore each
        category to see where improvements can be made.
      </p>
    </section>
  );
}
