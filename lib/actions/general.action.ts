'use server';

import { db } from "@/firebase/admin";

export async function getInterviewsByUserId(userId: string): Promise<Interview[] | null> {
    try {
        const interviews = await db
            .collection("interviews")
            .where("userId", "==", userId)
            .orderBy("createdAt", "desc")
            .get();
        return interviews.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as Interview[];

    } catch (error) {
        console.error("Error getting interview by user ID:", error);
        return null;
    }
};

export async function getLatestInterviews(params: GetLatestInterviewsParams): Promise<Interview[] | null> {
    try {
        const { userId, limit = 20 } = params;

        const interviews = await db
            .collection("interviews")
            .orderBy("createdAt", "desc")
            .where("finalize", "==", true)
            .where("userId", "!=", userId)
            .limit(limit)
            .get();

        return interviews.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as Interview[];
    } catch (error) {
        console.error("Error getting latest interviews: ", error);
        return null;
    }
}

export async function getInterviewById(interviewId: string): Promise<Interview | null> {
    try {
        const interview = await db
            .collection("interviews")
            .doc(interviewId)
            .get();
        return interview.data() as Interview || null;

    } catch (error) {
        console.error("Error getting interview by ID:", error);
        return null;
    }
};