"use client";

import { signOut } from "@/lib/actions/auth.action";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

const SignOut = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/sign-in");
  };

  return (
    <Button
      onClick={handleSignOut}
      className="ml-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
    >
      Sign Out
    </Button>
  );
};

export default SignOut;
