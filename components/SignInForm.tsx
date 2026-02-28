"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { auth } from "@/firebase/client";
import { signIn } from "@/lib/actions/auth.action";
import { signInWithEmailAndPassword } from "firebase/auth";

import { AlertCircle } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const signInSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Please enter a password"),
});

type SignInFormData = z.infer<typeof signInSchema>;

const SignInForm = () => {
    const {
        control,
        handleSubmit,
        formState: { isSubmitting },
    } = useForm<SignInFormData>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const router = useRouter();

    const onSubmit = async (values: SignInFormData) => {
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));

            const { email, password } = values;

            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password,
            );

            const idToken = await userCredential.user.getIdToken();
            if (!idToken) {
                toast.error("Sign in failed.");
                return;
            }

            const result = await signIn({
                email,
                idToken,
            });

            if (!result?.success) {
                toast.error(result?.message);
                return;
            }

            toast.success(result.message);
            router.push("/");

            console.log("Form submitted:", {
                email: values.email,
                password: values.password,
            });

            toast.success("Account sign in successfully!", {
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
                                    Signing in...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </Button>
                    </motion.div>
                </form>

                <p className="text-center">
                    No Account yet?
                    <Link
                        href="/sign-up"
                        className="font-bold text-user-primary ml-1"
                    >
                        Sign Up
                    </Link>
                </p>
            </div>
        </motion.div>
    );
};

export default SignInForm;
