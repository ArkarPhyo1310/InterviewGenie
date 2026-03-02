import { Button } from "@/components/ui/button";
import { getFeedbackByInterviewId } from "@/lib/actions/general.action";
import { getRandomInterviewCover } from "@/lib/utils";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import DisplayTechIcons from "./DisplayTechIcons";

const InterviewCard = async ({
  id,
  role,
  type,
  user_id,
  techstack,
  cover_image,
  created_at,
}: InterviewCardProps) => {
  const feedback =
    user_id && id ? await getFeedbackByInterviewId({ interviewId: id, userId: user_id }) : null;
  const normalizedType = /mix/gi.test(type) ? "Mixed" : type;
  const formattedDate = dayjs(feedback?.created_at || created_at || Date.now()).format(
    "MMM D, YYYY",
  );

  return (
    <div className="card-border w-90 max-sm:w-full min-h-96">
      <div className="card-interview">
        <div>
          <div className="absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg bg-light-600">
            <p className="badge-text">{normalizedType}</p>
          </div>
          <Image
            src={cover_image || getRandomInterviewCover()}
            alt="cover-image"
            width={90}
            height={90}
            className="rounded-full object-fit size-22.5"
          ></Image>

          <h3 className="mt-5 capitalize">{role} Interview</h3>
          <div className="flex flex-row gap-5 mt-3">
            <div className="flex flex-row gap-2">
              <Image src="/calendar.svg" alt="calendar" width={23} height={23}></Image>
              <p>{formattedDate}</p>
            </div>

            <div className="flex flex-row gap-2 items-center">
              <Image src="/star.svg" alt="star" width={22} height={22}></Image>
              <p>{feedback?.total_score || "---"} / 100</p>
            </div>
          </div>
          <p className="line-clamp-2 mt-5">
            {feedback?.final_assessment ||
              "You haven't taken the interview yet. Take it now to improve your skills."}
          </p>
        </div>
        <div className="flex flex-row justify-between">
          <DisplayTechIcons techStack={techstack} />

          <Button className="btn-primary">
            <Link href={feedback ? `/interview/${id}/feedback` : `/interview/${id}`}>
              {feedback ? "Check Feedback" : "View Interview"}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InterviewCard;
