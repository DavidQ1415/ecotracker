"use client";

import { useState, useEffect } from "react";

const questions = [
  "I eat mostly plant-based foods.",
  "I minimize food waste in my home.",
  "I choose locally produced ingredients when possible.",
];

export default function FoodSurvey() {
  const [answers, setAnswers] = useState<number[]>(Array(questions.length).fill(3));
  const [selected, setSelected] = useState<number>(0);

  useEffect(() => {
    localStorage.setItem("foodCategory", JSON.stringify(answers));
  }, [answers]);

  const handleChange = (index: number, value: number) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const labels = ["Strongly Disagree", "Somewhat Disagree", "Neutral", "Somewhat Agree", "Strongly Agree"];

  const handleSliderChange = (value: number) => {
    handleChange(selected, value);
  };

  return (
    <section className="flex flex-col items-center gap-6">
      <h2 className="text-2xl font-semibold text-[var(--accent)]">Food</h2>
      <div className="w-full max-w-2xl flex flex-col items-center gap-4">
        <div className="w-full grid gap-2">
          {questions.map((q, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelected(i)}
              className={`text-left p-3 rounded-md border transition-colors flex justify-between items-center ${
                selected === i ? "bg-[rgba(34,197,94,0.08)] border-[var(--accent)]" : "border-gray-200"
              }`}
            >
              <span>{q}</span>
              <span className="text-sm text-gray-600">{labels[answers[i] - 1]} ({answers[i]})</span>
            </button>
          ))}
        </div>

        <div className="flex flex-col items-center mt-2">
          <p className="mb-2 font-medium">Adjust answer for: <span className="text-[var(--accent)]">{questions[selected]}</span></p>
          <input
            aria-label={`Answer for ${questions[selected]}`}
            type="range"
            min={1}
            max={5}
            value={answers[selected]}
            onChange={(e) => handleSliderChange(Number(e.target.value))}
            className="w-64 accent-[var(--accent)]"
          />

          <div className="flex justify-between items-center text-xs text-gray-600 w-64 mt-1">
            <span className="text-left">Strongly Disagree</span>
            <span className="text-center">Neutral</span>
            <span className="text-right">Strongly Agree</span>
          </div>

          <div className="mt-2 text-sm text-gray-700">
            Current: <span className="font-semibold">{labels[answers[selected] - 1]}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
