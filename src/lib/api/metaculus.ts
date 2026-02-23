import { HistoricalDataPoint } from "../types";

interface MetaculusQuestion {
  id: number;
  title: string;
  community_prediction?: {
    full?: {
      q1?: number;
      q2?: number;
      q3?: number;
    };
  };
  my_predictions?: {
    predictions?: Array<{
      t: number;
      x: number;
    }>;
  };
}

export async function fetchMetaculusQuestion(
  questionId: number
): Promise<{
  title: string;
  currentPrediction: number | null;
  history: HistoricalDataPoint[];
} | null> {
  try {
    const res = await fetch(
      `https://www.metaculus.com/api2/questions/${questionId}/`,
      {
        headers: { Accept: "application/json" },
        next: { revalidate: 3600 },
      }
    );

    if (!res.ok) return null;

    const data: MetaculusQuestion = await res.json();

    const prediction = data.community_prediction?.full;
    const currentPrediction = prediction?.q2
      ? Math.round(prediction.q2 * 100)
      : null;

    return {
      title: data.title,
      currentPrediction,
      history: [],
    };
  } catch {
    return null;
  }
}
