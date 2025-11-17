/**
 * Utility functions for working with surveys
 */

export interface SurveyResponse {
  id: string
  footprintScore: number
  createdAt: string
}

/**
 * Save survey score to database
 */
export async function saveSurveyScore(score: number): Promise<SurveyResponse> {
  const response = await fetch("/api/surveys", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ footprintScore: score }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to save survey")
  }

  const result = await response.json()
  return result.survey
}

/**
 * Get all surveys for the current user
 */
export async function getSurveys(): Promise<SurveyResponse[]> {
  const response = await fetch("/api/surveys")

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to fetch surveys")
  }

  const result = await response.json()
  return result.surveys
}

/**
 * Get a specific survey by ID
 */
export async function getSurvey(id: string): Promise<SurveyResponse> {
  const response = await fetch(`/api/surveys/${id}`)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to fetch survey")
  }

  const result = await response.json()
  return result.survey
}

/**
 * Update a survey
 */
export async function updateSurvey(
  id: string,
  score: number
): Promise<SurveyResponse> {
  const response = await fetch(`/api/surveys/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ footprintScore: score }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to update survey")
  }

  const result = await response.json()
  return result.survey
}

/**
 * Delete a survey
 */
export async function deleteSurvey(id: string): Promise<void> {
  const response = await fetch(`/api/surveys/${id}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to delete survey")
  }
}

