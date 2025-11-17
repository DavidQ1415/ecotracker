"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  TooltipProps
} from "recharts";
import {
  ValueType,
  NameType
} from "recharts/types/component/DefaultTooltipContent";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

interface Survey {
  id: string;
  footprintScore: number;
  createdAt: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    if (status === "authenticated") {
      fetchSurveys();
    }
  }, [status, router]);

  const fetchSurveys = async () => {
    try {
      const response = await fetch("/api/surveys");
      if (response.ok) {
        const data = await response.json();
        setSurveys(data.surveys || []);
      }
    } catch (error) {
      console.error("Error fetching surveys:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  // Format data for charts
  const chartData = surveys
    .map((survey) => ({
      date: new Date(survey.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      score: Number(survey.footprintScore), // Ensure it's a number
      fullDate: new Date(survey.createdAt),
    }))
    .sort((a, b) => a.fullDate.getTime() - b.fullDate.getTime());

  // Calculate Y-axis domain for better visualization
  const scores = chartData.map((d) => d.score);
  const minScore = Math.min(...scores, 0);
  const maxScore = Math.max(...scores, 100);
  const yAxisDomain = [Math.max(0, minScore - 10), maxScore + 10];

  // Custom tooltip component
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: TooltipProps<ValueType, NameType> & {
    payload?: { value: number }[];
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;

      return (
        <div className="bg-white dark:bg-gray-700 p-3 border border-gray-300 dark:border-gray-600 rounded shadow-lg">
          <p className="font-semibold mb-1 text-[var(--foreground)]">{`Date: ${label}`}</p>
          <p className="text-[#2f855a] font-bold text-lg">
            {`Footprint Score: ${value}`}
          </p>
        </div>
      );
    }
    return null;
  };

  const averageScore =
    surveys.length > 0
      ? Math.round(
        surveys.reduce((sum, s) => sum + s.footprintScore, 0) / surveys.length
      )
      : 0;
  const latestScore = surveys.length > 0 ? surveys[0].footprintScore : 0;
  const bestScore =
    surveys.length > 0
      ? Math.min(...surveys.map((s) => s.footprintScore))
      : 0;

  return (
    <div className="min-h-screen bg-[var(--background)] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-[var(--accent)] mb-2">
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Welcome back, {session.user?.name || session.user?.email}!
            </p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/survey/consumption"
              className="px-4 py-2 bg-[var(--accent)] text-white rounded-md hover:opacity-90 transition"
            >
              New Survey
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Latest Score
            </h3>
            <p className="text-3xl font-bold text-[var(--accent)]">
              {latestScore}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Average Score
            </h3>
            <p className="text-3xl font-bold text-[var(--accent)]">
              {averageScore}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Best Score
            </h3>
            <p className="text-3xl font-bold text-[var(--accent)]">
              {bestScore}
            </p>
          </div>
        </div>

        {/* Charts */}
        {surveys.length > 0 ? (
          <div className="space-y-8">
            {/* Line Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-2xl font-semibold mb-4 text-[var(--foreground)]">
                Score Over Time
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={yAxisDomain} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#2f855a"
                    strokeWidth={2}
                    name="Footprint Score"
                    dot={{ fill: "#2f855a", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Bar Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-2xl font-semibold mb-4 text-[var(--foreground)]">
                Score History
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={yAxisDomain} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar
                    dataKey="score"
                    fill="#2f855a"
                    name="Footprint Score"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Recent Surveys List */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-2xl font-semibold mb-4 text-[var(--foreground)]">
                Recent Surveys
              </h2>
              <div className="space-y-2">
                {surveys.slice(0, 10).map((survey) => (
                  <div
                    key={survey.id}
                    className="flex justify-between items-center p-3 border-b border-gray-200 dark:border-gray-700"
                  >
                    <span className="text-gray-600 dark:text-gray-400">
                      {new Date(survey.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <span className="text-xl font-semibold text-[var(--accent)]">
                      {survey.footprintScore}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
            <h2 className="text-2xl font-semibold mb-4 text-[var(--foreground)]">
              No surveys yet
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Complete a survey to start tracking your ecological footprint!
            </p>
            <Link
              href="/survey/consumption"
              className="inline-block px-6 py-3 bg-[var(--accent)] text-white rounded-md hover:opacity-90 transition"
            >
              Start Your First Survey
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

