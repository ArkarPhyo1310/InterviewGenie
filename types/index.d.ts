interface Feedback {
  id: string;
  interview_id: string;
  user_id: string;
  total_score: number;
  category_scores: Array<{
    name: string;
    score: number;
    comment: string;
  }>;
  strengths: string[];
  areas_for_improvement: string[];
  final_assessment: string;
  created_at: string;
}

interface Interview {
  id: string;
  role: string;
  level: string;
  questions: string[];
  techstack: string[];
  created_at: string;
  user_id: string;
  cover_image: string;
  type: string;
  finalized: boolean;
}

interface CreateFeedbackParams {
  interview_id: string;
  user_id: string;
  transcript: { role: string; content: string }[];
  feedback_id?: string;
}

interface User {
  name: string;
  email: string;
  id: string;
  pic: string;
}

interface InterviewCardProps {
  id?: string;
  user_id?: string;
  role: string;
  type: string;
  cover_image?: string;
  techstack: string[];
  created_at?: string;
}

interface AgentProps {
  userName: string;
  userId?: string;
  userPic?: string;
  interviewId?: string;
  feedbackId?: string;
  type: "generate" | "interview";
  questions?: string[];
}

interface RouteParams {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string>>;
}

interface GetFeedbackByInterviewIdParams {
  interviewId: string;
  userId: string;
}

interface GetLatestInterviewsParams {
  userId: string;
  limit?: number;
}

interface SignInParams {
  email: string;
  password: string;
}

interface SignUpParams {
  name: string;
  email: string;
  password: string;
  profileURL: string;
  createdAt?: Date;
}

interface SignUpResult {
  success: boolean;
  message: string;
  userId?: string;
}

interface UpdateUserMediaParams {
  userId: string;
  profileURL: string;
}

interface AuthResult {
  success: boolean;
  message: string;
}

interface InterviewFormProps {
  interviewId: string;
  role: string;
  level: string;
  type: string;
  techstack: string[];
  amount: number;
}

interface TechIconProps {
  techStack: string[];
}

type FormType = "sign-in" | "sign-up";
