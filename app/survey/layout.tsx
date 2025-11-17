"use client";

import { usePathname, useRouter } from "next/navigation";
import { surveyOrder } from "@/app/lib/surveyOrder";

export default function SurveyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const current = pathname.split("/")[2];
  const index = surveyOrder.indexOf(current);

  const goNext = () => {
    if (index < surveyOrder.length - 1) {
      router.push(`/survey/${surveyOrder[index + 1]}`);
    }
  };

  const goBack = () => {
    if (index > 0) {
      router.push(`/survey/${surveyOrder[index - 1]}`);
    } else {
      router.push("/");
    }
  };

  const buttonClass =
    "px-6 py-3 rounded-md bg-[var(--accent)] text-white hover:opacity-90 transition";

  return (
    <main className="min-h-screen flex flex-col items-center justify-between p-8">
      <section className="flex-1 w-full flex items-center justify-center">
        {children}
      </section>

      <nav className="flex justify-between w-full max-w-xl mt-8">
        {index !== -1 && (
          <>
            <button onClick={goBack} className={buttonClass}>
              Back
            </button>
            {index < surveyOrder.length - 1 ? (
              <button onClick={goNext} className={buttonClass}>
                Next
              </button>
            ) : (
              <button
                onClick={() => router.push("/survey/result")}
                className={buttonClass}
              >
                View Results
              </button>
            )}
          </>
        )}
      </nav>
    </main>
  );
}
