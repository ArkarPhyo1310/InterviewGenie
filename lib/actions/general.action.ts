"use server";

import { feedbackSchema } from "@/constants";
import { createClient } from "@/supabase/server";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export async function createFeedback(params: CreateFeedbackParams) {
  const { interview_id, user_id, transcript, feedback_id } = params;
  const supabase = await createClient();

  console.log("Creating feedback with params:", { interview_id, user_id, transcript, feedback_id });

  try {
    const formattedTranscript = transcript
      .map(
        (sentence: { role: string; content: string }) =>
          `- ${sentence.role}: ${sentence.content}\n`,
      )
      .join("");

    const { output } = await generateText({
      model: google("gemini-2.5-flash"),
      output: feedbackSchema,
      prompt: `
        You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.
        Transcript:
        ${formattedTranscript}

        Please score the candidate from 0 to 100 in the following areas. Do not add categories other than the ones provided:
        - **Communication Skills**: Clarity, articulation, structured responses.
        - **Technical Knowledge**: Understanding of key concepts for the role.
        - **Problem-Solving**: Ability to analyze problems and propose solutions.
        - **Cultural & Role Fit**: Alignment with company values and job role.
        - **Confidence & Clarity**: Confidence in responses, engagement, and clarity.
        `,
      system:
        "You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories",
    });

    const feedback: Omit<Feedback, "id"> = {
      interview_id,
      user_id,
      total_score: output.totalScore,
      category_scores: output.categoryScores,
      strengths: output.strengths.split(",").map((s) => s.trim()),
      areas_for_improvement: output.areasForImprovement.split(",").map((s) => s.trim()),
      final_assessment: output.finalAssessment,
      created_at: new Date().toISOString(),
    };

    let res;
    if (feedback_id) {
      res = await supabase.from("feedback").update(feedback).eq("id", feedback_id);
    } else {
      res = await supabase.from("feedback").insert(feedback).select();
    }

    if (res.error) {
      console.error("Error saving feedback:", res.error);
      return { success: false, feedbackId: null };
    }

    const id = feedback_id || res.data?.[0]?.id;
    return { success: true, feedbackId: id };
  } catch (error) {
    console.error("Error saving feedback:", error);
    return { success: false, feedbackId: null };
  }
}

export async function getInterviewById(id: string): Promise<Interview | null> {
  const supabase = await createClient();

  const { data, error } = await supabase.from("interviews").select("*").eq("id", id).single();

  if (error || !data) return null;
  return data as Interview;
}

export async function getFeedbackByInterviewId(
  params: GetFeedbackByInterviewIdParams,
): Promise<Feedback | null> {
  const { interviewId, userId } = params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("feedback")
    .select("*")
    .eq("interview_id", interviewId)
    .eq("user_id", userId)
    .limit(1)
    .single();

  if (error || !data) return null;
  return data as Feedback;
}

export async function getLatestInterviews(
  params: GetLatestInterviewsParams,
): Promise<Interview[] | null> {
  const { userId, limit = 20 } = params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("interviews")
    .select("*")
    .neq("user_id", userId)
    .eq("finalized", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) return null;
  return data as Interview[];
}

export async function getInterviewsByUserId(userId: string): Promise<Interview[] | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("interviews")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error || !data) return null;
  return data as Interview[];
}
