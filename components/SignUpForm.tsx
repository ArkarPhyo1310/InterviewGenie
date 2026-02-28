"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { auth } from "@/firebase/client";
import { signUp } from "@/lib/actions/auth.action";
import { createUserWithEmailAndPassword } from "firebase/auth";

import { AlertCircle, Check, Upload } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useMemo } from "react";

const signUpSchema = z.object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(
            /[^A-Za-z0-9]/,
            "Password must contain at least one special character",
        ),
    profilePicture: z
        .any()
        .refine(
            (files) => files && files.length > 0,
            "Profile picture is required",
        ),
    resume: z
        .any()
        .refine((files) => files && files.length > 0, "Resume is required"),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

function calcPasswordStrength(password: string): {
    strength: "weak" | "medium" | "strong";
    score: number;
} {
    if (!password) return { strength: "weak", score: 0 };

    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Aa-z0-9]/.test(password)) score++;

    if (score <= 2) return { strength: "weak", score };
    if (score <= 4) return { strength: "medium", score };

    return { strength: "strong", score };
}

const SignUpForm = () => {
    const {
        control,
        handleSubmit,
        watch,
        formState: { isSubmitting },
    } = useForm<SignUpFormData>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            fullName: "",
            email: "",
            password: "",
        },
    });

    const router = useRouter();

    const password = watch("password", "");
    const profilePictureFile = watch("profilePicture");
    const resumeFiles = watch("resume");

    const passwordStrength = useMemo(
        () => calcPasswordStrength(password),
        [password],
    );

    const getStrengthColor = (strength: "weak" | "medium" | "strong") => {
        switch (strength) {
            case "weak":
                return "bg-red-500";
            case "medium":
                return "bg-yellow-500";
            case "strong":
                return "bg-green-500";
        }
    };

    const getStrengthWidth = (score: number) => {
        return `${(score / 5) * 100}%`;
    };

    const onSubmit = async (values: SignUpFormData) => {
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));

            const { fullName, email, password } = values;

            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password,
            );

            const result = await signUp({
                uid: userCredential.user.uid,
                name: fullName!,
                email: email,
                password: password,
            });

            if (!result?.success) {
                toast.error(result?.message);
                return;
            }

            toast.success(result.message);
            router.push("/sign-in");

            console.log("Form submitted:", {
                fullName: values.fullName,
                email: values.email,
                password: values.password,
                profilePicture: values.profilePicture[0],
                resume: values.resume[0],
            });

            toast.success("Account created successfully!", {
                description:
                    "Welcome to PrepWise. You can now start practicing interviews.",
            });
        } catch (error) {
            console.log(error);
            toast.error(`There was an error: ${error}`);
        }
    };

    return (
        <motion.div className="card-border lg:min-w-[566px]">
            <div className="flex flex-col gap-6 card py-14 px-10">
                <div className="flex flex-row gap-2 justify-center">
                    <Image src="/logo.svg" alt="logo" width={32} height={38} />
                    <h2 className="text-primary-100">InterviewGenie</h2>
                </div>
                <h3>Practice Interviews with AI</h3>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="w-full space-y-8 mt-4 form"
                >
                    <Controller
                        name="fullName"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="name">
                                    Full name
                                </FieldLabel>
                                <Input
                                    {...field}
                                    id="name"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="Your Name"
                                    autoComplete="off"
                                />
                                {fieldState.invalid && (
                                    <>
                                        <AlertCircle className="w-4 h-4" />
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
                                    </>
                                )}
                            </Field>
                        )}
                    />

                    <Controller
                        name="email"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    {...field}
                                    id="email"
                                    type="email"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="johndoe@gmail.com"
                                    autoComplete="on"
                                />
                                {fieldState.invalid && (
                                    <>
                                        <AlertCircle className="w-4 h-4" />
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
                                    </>
                                )}
                            </Field>
                        )}
                    />

                    <Controller
                        name="password"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="password">
                                    Password
                                </FieldLabel>
                                <Input
                                    {...field}
                                    id="password"
                                    type="password"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="Your Password"
                                    autoComplete="off"
                                />

                                {password && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        className="mt-3"
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-gray-400 text-xs">
                                                Password strength:
                                            </span>
                                            <span
                                                className={`text-xs capitalize ${getStrengthColor(
                                                    passwordStrength.strength,
                                                )}`}
                                            >
                                                {passwordStrength.strength ===
                                                    "strong" && (
                                                    <Check className="w-3 h-3 inline mr-1" />
                                                )}
                                                {passwordStrength.strength}
                                            </span>
                                        </div>
                                        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{
                                                    width: getStrengthWidth(
                                                        passwordStrength.score,
                                                    ),
                                                }}
                                                transition={{ duration: 0.3 }}
                                                className={`h-full ${getStrengthColor(passwordStrength.strength)}`}
                                            />
                                        </div>
                                    </motion.div>
                                )}
                                {fieldState.invalid && (
                                    <>
                                        <AlertCircle className="w-4 h-4" />
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
                                    </>
                                )}
                            </Field>
                        )}
                    />

                    <Controller
                        name="profilePicture"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="profilePicture">
                                    Profile Picture
                                </FieldLabel>
                                <Label className="w-full bg-[#2a2a3a] text-gray-300 rounded-full px-6 py-4 flex items-center justify-center gap-2 cursor-pointer hover:bg-[#323242] transition-colors border border-gray-700">
                                    <Upload className="w-5 h-5" />
                                    <span>
                                        {profilePictureFile &&
                                        profilePictureFile.length > 0
                                            ? profilePictureFile[0].name
                                            : "Upload an image"}
                                    </span>
                                    <Input
                                        {...field}
                                        type="file"
                                        id="profilePicture"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) =>
                                            field.onChange(e.target.files)
                                        }
                                    />
                                </Label>

                                {fieldState.invalid && (
                                    <>
                                        <AlertCircle className="w-4 h-4" />
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
                                    </>
                                )}
                            </Field>
                        )}
                    />

                    <Controller
                        name="resume"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="resume">Resume</FieldLabel>
                                <Label className="w-full bg-[#2a2a3a] text-gray-300 rounded-full px-6 py-4 flex items-center justify-center gap-2 cursor-pointer hover:bg-[#323242] transition-colors border border-gray-700">
                                    <Upload className="w-5 h-5" />
                                    <span>
                                        {resumeFiles && resumeFiles.length > 0
                                            ? resumeFiles[0].name
                                            : "Upload a pdf"}
                                    </span>
                                    <Input
                                        {...field}
                                        type="file"
                                        id="resume"
                                        accept=".pdf"
                                        className="hidden"
                                        onChange={(e) =>
                                            field.onChange(e.target.files)
                                        }
                                    />
                                </Label>

                                {fieldState.invalid && (
                                    <>
                                        <AlertCircle className="w-4 h-4" />
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
                                    </>
                                )}
                            </Field>
                        )}
                    />

                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Button
                            className="btn"
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Spinner data-icon="inline-start" />
                                    Creating account...
                                </>
                            ) : (
                                "Create an Account"
                            )}
                        </Button>
                    </motion.div>
                </form>

                <p className="text-center">
                    Already have an Account?
                    <Link
                        href="/sign-in"
                        className="font-bold text-user-primary ml-1"
                    >
                        Sign In
                    </Link>
                </p>
            </div>
        </motion.div>
    );
};

export default SignUpForm;
