import { getCurrentUser } from "@/lib/actions/auth.action";
import { getRandomInterviewCover } from "@/lib/utils";
import { createClient } from "@/supabase/server";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { cookies } from "next/headers";

export async function GET() {
  return Response.json({ success: true, data: "Thank You!" }, { status: 200 });
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const user = await getCurrentUser();

  const { type, role, level, techstack, amount } = await request.json();

  try {
    const { text: questions } = await generateText({
      model: google("gemini-2.5-flash"),
      prompt: `Prepare questions for a job interview.
            The job role is ${role}.
            The job experience level is ${level}.
            The tech stack used in the job is ${techstack}.
            The focus between behavioral and technical questions should lean towards: ${type}.
            The amount of questions required is ${amount}.
            Please return only the questions, without any additional text or explanations.
            The questions are going to be used in a real-time voice interview, so they should be clear and concise.
            So, please do not use "/" or "*" or any other special characters which might break the voice assistant.
            The questions should be in the following format:
            ["Question 1", "Question 2", "Question 3", ...]
            `,
    });

    const interview = {
      role,
      type,
      level,
      techstack: techstack.split(","),
      questions: JSON.parse(questions),
      user_id: user?.id,
      finalized: true,
      cover_image: getRandomInterviewCover(),
      created_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("interviews").insert(interview);

    if (error) {
      console.error("Failed to insert interview:", error);
      return Response.json(
        { success: false, error: "Failed to save interview. Error: " + error.message },
        { status: 500 },
      );
    }

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    return Response.json({ success: false, error }, { status: 500 });
  }
}
