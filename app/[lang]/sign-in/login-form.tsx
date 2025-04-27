"use client";

import { useState, useEffect, JSX } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  motion,
  AnimatePresence,
  Variants,
  Transition,
  TargetAndTransition,
} from "framer-motion";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/auth-context";

interface LoginFormProps {
  dictionary: {
    signIn: {
      title: string;
      description: string;
      username: string;
      password: string;
      button: string;
      buttonLoading: string;
      errors: {
        generic: string;
        tooManyAttempts: string;
        tryLater: string;
      };
      success: {
        title: string;
        description: string;
      };
      validation: {
        username: {
          min: string;
          max: string;
          invalid: string;
        };
        password: {
          min: string;
          max: string;
        };
      };
    };
  };
}

// Interface InputWithAnimationProps and LoginResponse definitions
interface InputWithAnimationProps {
  field: any;
  type?: string;
  placeholder: string;
}

interface LoginResponse {
  token: string;
  expires_in: number;
  message?: string;
}

export default function LoginForm({ dictionary }: LoginFormProps): JSX.Element {
  const { signIn } = dictionary;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { setAccessToken } = useAuth();
  const [attempts, setAttempts] = useState<number>(0);
  const MAX_ATTEMPTS = 5;
  const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes

  // Define the shape of our form schema with localized messages
  const formSchema = z.object({
    username: z
      .string()
      .min(3, { message: signIn.validation.username.min })
      .max(50, { message: signIn.validation.username.max })
      .regex(/^[a-zA-Z0-9_-]+$/, {
        message: signIn.validation.username.invalid,
      }),
    password: z
      .string()
      .min(8, { message: signIn.validation.password.min })
      .max(100, { message: signIn.validation.password.max }),
  });

  // Define types for form values
  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Animation variants for Framer Motion
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0, y: -20, transition: { duration: 0.5 } },
  };

  const titleVariants: Variants = {
    hidden: { y: 100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 1,
        ease: [0.25, 0.1, 0.25, 1.0],
      },
    },
  };

  const descVariants: Variants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1.0],
        delay: 0.5,
      },
    },
  };

  const formFieldVariants: Variants = {
    hidden: { y: 30, opacity: 0 },
    visible: (custom: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1.0],
        delay: 0.3 + custom * 0.2,
      },
    }),
  };

  const buttonVariants: Variants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.175, 0.885, 0.32, 1.275],
        delay: 0.8,
      },
    },
  };

  useEffect(() => {
    // Restore form data from sessionStorage
    const savedData = sessionStorage.getItem("loginForm");
    if (savedData) {
      try {
        const { username } = JSON.parse(savedData) as { username: string };
        form.setValue("username", username);
      } catch (error) {
        console.error("Failed to parse saved form data:", error);
        // Clear corrupted data
        sessionStorage.removeItem("loginForm");
      }
    }
  }, [form]);

  async function onSubmit(values: FormValues): Promise<void> {
    if (attempts >= MAX_ATTEMPTS) {
      const lastAttempt = Number(
        localStorage.getItem("lastLoginAttempt") || "0"
      );
      if (Date.now() - lastAttempt < LOCKOUT_TIME) {
        toast.error(signIn.errors.tooManyAttempts, {
          description: signIn.errors.tryLater,
        });
        return;
      }
      setAttempts(0);
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/sign-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
        credentials: "include", // Important for cookies
      });

      const data = (await response.json()) as LoginResponse;

      if (response.ok) {
        setAccessToken(data.token, data.expires_in);

        // Save form data
        sessionStorage.setItem(
          "loginForm",
          JSON.stringify({ username: values.username })
        );

        toast.success(signIn.success.title, {
          description: signIn.success.description,
        });

        router.push("/");
      } else {
        throw new Error(data.message || signIn.errors.generic);
      }
    } catch (error) {
      setAttempts((prev) => prev + 1);
      localStorage.setItem("lastLoginAttempt", Date.now().toString());

      toast.error("Error", {
        description:
          error instanceof Error ? error.message : signIn.errors.generic,
      });
    } finally {
      setIsLoading(false);
    }
  }

  const InputWithAnimation = ({
    field,
    type = "text",
    placeholder,
  }: InputWithAnimationProps): JSX.Element => {
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);

    const handleError = (): void => {
      setIsError(true);
      setTimeout(() => setIsError(false), 1000);
    };

    const errorAnimation: TargetAndTransition = isError
      ? {
          x: [0, 10, -10, 10, -10, 10, -10, 0],
          transition: { duration: 0.5 } as Transition,
        }
      : {};

    const styleAnimation: TargetAndTransition = {
      scale: isFocused ? 1.01 : 1,
      boxShadow: isError ? "0 0 15px rgba(239, 68, 68, 0.6)" : "none",
      borderColor: isError
        ? "rgb(239, 68, 68)"
        : isFocused
        ? "rgb(59, 130, 246)"
        : "rgb(229, 231, 235)",
    };

    return (
      <motion.div animate={errorAnimation}>
        <motion.div animate={styleAnimation} transition={{ duration: 0.3 }}>
          <Input
            className="h-12 md:h-10 px-4 text-base"
            type={type}
            placeholder={placeholder}
            {...field}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className="m-4 md:m-0 flex justify-center items-center min-h-[100dvh]">
      <AnimatePresence>
        <motion.div
          className="w-full mx-auto max-w-md space-y-6 p-6 md:p-0"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="space-y-2 text-center overflow-hidden">
            <motion.h1
              className="text-2xl md:text-3xl font-bold tracking-tight"
              variants={titleVariants}
            >
              {signIn.title}
            </motion.h1>
            <motion.p
              className="text-sm md:text-base text-zinc-500"
              variants={descVariants}
            >
              {signIn.description}
            </motion.p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <motion.div
                variants={formFieldVariants}
                custom={0}
                initial="hidden"
                animate="visible"
              >
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-base">
                        {signIn.username}
                      </FormLabel>
                      <FormControl>
                        <InputWithAnimation
                          field={field}
                          placeholder="ivanov"
                        />
                      </FormControl>
                      <FormMessage className="text-sm" />
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div
                variants={formFieldVariants}
                custom={1}
                initial="hidden"
                animate="visible"
              >
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-base">
                        {signIn.password}
                      </FormLabel>
                      <FormControl>
                        <InputWithAnimation
                          field={field}
                          type="password"
                          placeholder="••••••••"
                        />
                      </FormControl>
                      <FormMessage className="text-sm" />
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div
                variants={buttonVariants}
                initial="hidden"
                animate="visible"
              >
                <Button
                  type="submit"
                  className="w-full h-12 md:h-10 text-base"
                  disabled={isLoading}
                >
                  {isLoading ? signIn.buttonLoading : signIn.button}
                </Button>
              </motion.div>
            </form>
          </Form>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
