"use server";

// Supabase server client handles auth & session cookies automatically
import { createClient } from "@/supabase/server";

// The helper above returns a supabase client that will read & write
// the appropriate auth cookies when used from server components or
// server actions.

export async function signUp(params: SignUpParams): Promise<SignUpResult> {
  const { name, email, password, profileURL, createdAt } = params;
  const supabase = await createClient();

  try {
    // create user via supabase auth
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.signUp({ email, password });

    if (authError) {
      console.error("Supabase auth signUp error:", authError);
      return {
        success: false,
        message: authError.message || "Failed to create account. Please try again.",
      };
    }

    if (!user || !user.id) {
      return {
        success: false,
        message: "Unable to create user. Please try again.",
      };
    }

    const uid = user.id;

    // insert the additional profile information into users table
    const { error: dbError } = await supabase.from("users").insert({
      id: uid,
      name,
      email,
      profile_url: profileURL,
      created_at: createdAt ? createdAt.toISOString() : new Date().toISOString(),
    });

    if (dbError) {
      console.error("Supabase insert user error:", dbError);
      // if insertion fails, delete auth user to avoid orphaned account
      await supabase.auth.admin.deleteUser(uid);
      return {
        success: false,
        message: "Failed to create user profile. Please try again.",
      };
    }

    return {
      success: true,
      message: "Account created successfully. Please sign in.",
      userId: uid,
    } as { success: boolean; message: string; userId?: string };
  } catch (error) {
    console.error("Error creating user:", error);
    return {
      success: false,
      message: "Failed to create account. Please try again.",
    };
  }
}

export async function signIn(params: SignInParams) {
  const { email, password } = params;
  const supabase = await createClient();

  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.signInWithPassword({ email, password });

    if (error || !session) {
      console.error("Supabase auth signIn error:", error);
      return {
        success: false,
        message: (error && error.message) || "Failed to log into account. Please try again.",
      };
    }

    return { success: true, message: "Signed in successfully." };
  } catch (error) {
    console.error("Error signing in user:", error);

    return {
      success: false,
      message: "Failed to log into account. Please try again.",
    };
  }
}

// Sign out user by calling supabase and letting it clear cookies
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
}

// Get current user from supabase session
export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createClient();

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) return null;

    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) return null;

    return {
      id: user.id,
      name: profile.name,
      email: profile.email,
      pic: profile.profile_url,
    } as User;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

// helper to update profile URLs after sign up or when needed
export async function updateUserMedia(params: UpdateUserMediaParams) {
  const { userId, profileURL } = params;
  const supabase = await createClient();

  const { error } = await supabase
    .from("users")
    .update({ profile_url: profileURL })
    .eq("id", userId);

  if (error) {
    console.error("Failed to update user media URLs", error);
    return { success: false, message: "Unable to update profile information." };
  }

  return { success: true };
}

// Check if user is authenticated
export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}
