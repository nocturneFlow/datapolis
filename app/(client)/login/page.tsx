"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

const formSchema = z.object({
  email: z.string().email({
    message: "Пожалуйста введите существующий адрес электронной почты.",
  }),
  password: z
    .string()
    .min(8, { message: "Пароль должен содержать как минимум 8 символов." }),
  rememberMe: z.boolean().default(false),
});

// Define type for the form
type FormSchema = z.infer<typeof formSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize form with proper typing
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  // Handle form submission
  const onSubmit: SubmitHandler<FormSchema> = async (values) => {
    setIsLoading(true);
    setError(null);

    try {
      // This is where you would normally handle authentication
      console.log("Login details:", values);

      // Mock authentication - replace with your actual authentication logic
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Redirect after successful login
      router.push("/");
    } catch (err) {
      setError("Failed to login. Please check your credentials and try again.");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Добро пожаловать</h1>
          <p className="mt-2 text-sm text-gray-600">
            Войдите в свою учётную запись, чтобы продолжить
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Вход</CardTitle>
            <CardDescription>
              Введите свои учётные данные для входа в систему
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Электронная почта</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="your.email@example.com"
                          type="email"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Пароль</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="********"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Вход..." : "Войти"}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter>
            <div className="flex flex-col items-center justify-center">
              <p className="text-sm text-gray-600">
                Самостоятельная регистрация не поддерживается.
              </p>
              <p className="text-sm text-gray-600">
                Если у вас нет учетной записи, обратитесь к администратору.
              </p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
