import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { getRandomInterviewCover } from "@/lib/utils";
import { db } from "@/firebase/admin";

export async function GET() {
    return Response.json({ success: true, data: 'Thank You!' }, { status: 200 });
}

export async function POST(request: Request) {
    const { type, role, level, techstack, amount, userid } = await request.json();

    try {
        const { text: questions } = await generateText({
            model: google('gemini-2.5-flash-preview-04-17'),
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
            role, type, level,
            techstack: techstack.split(","),
            questions: JSON.parse(questions),
            userId: userid,
            finalized: true,
            coverImage: getRandomInterviewCover(),
            createdAt: new Date().toISOString()
        };

        await db.collection("interviews").add(interview);

        return Response.json({ success: true }, { status: 200 })
    } catch (error) {
        return Response.json({ success: false, error }, { status: 500 })
    }
}