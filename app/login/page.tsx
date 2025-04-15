"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { useSearchParams } from "next/navigation";

// Zod schema for form validation
const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(3, "Password must be at least 8 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const { login, loading, isAuthenticated } = useAuth();
  const searchParams = useSearchParams();
  const fromPath = searchParams.get("from");

  const [formData, setFormData] = useState<LoginFormData>({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});
  const [authError, setAuthError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Store redirect path in localStorage for access after login
  useEffect(() => {
    if (fromPath) {
      localStorage.setItem("fromPath", fromPath);
    }
  }, [fromPath]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing again
    if (errors[name as keyof LoginFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (authError) {
      setAuthError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    try {
      // Validate form data
      loginSchema.parse(formData);

      // Call authentication service login
      await login(formData.username, formData.password);

      // Login success - redirect happens in the useAuth hook
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<LoginFormData> = {};
        error.errors.forEach((err) => {
          const path = err.path[0] as keyof LoginFormData;
          fieldErrors[path] = err.message;
        });
        setErrors(fieldErrors);
      } else {
        // Handle authentication errors
        setAuthError(
          error instanceof Error
            ? error.message
            : "Failed to authenticate. Please try again."
        );
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full md:w-1/2 flex items-center justify-center p-8"
      >
        <div className="w-full max-w-md">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-4xl font-bold text-white mb-2">Welcome back</h1>
            <p className="text-gray-400 mb-8">
              Sign in to your account to continue
            </p>
          </motion.div>

          {authError && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6"
            >
              {authError}
            </motion.div>
          )}

          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="space-y-2">
              <label
                htmlFor="username"
                className="text-gray-300 text-sm font-medium"
              >
                Username
              </label>
              <motion.div whileFocus={{ scale: 1.01 }} className="relative">
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  className={`w-full p-3 rounded-lg bg-gray-800 text-white border ${
                    errors.username ? "border-red-500" : "border-gray-700"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200`}
                  placeholder="username"
                />
                {errors.username && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-500 text-xs mt-1"
                  >
                    {errors.username}
                  </motion.p>
                )}
              </motion.div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-gray-300 text-sm font-medium"
              >
                Password
              </label>
              <motion.div whileFocus={{ scale: 1.01 }} className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full p-3 rounded-lg bg-gray-800 text-white border ${
                    errors.password ? "border-red-500" : "border-gray-700"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-foreground hover:text-primary"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-500 text-xs mt-1"
                  >
                    {errors.password}
                  </motion.p>
                )}
              </motion.div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-700 bg-gray-800 text-blue-500 focus:ring-blue-500"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-300"
                >
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <Link
                  href="/forgot-password"
                  className="text-blue-500 hover:text-blue-400 transition"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center items-center py-3 px-4 rounded-lg text-white font-medium ${
                loading
                  ? "bg-blue-800 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } transition duration-200 shadow-lg`}
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Sign In"
              )}
            </motion.button>
          </motion.form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 text-center"
          >
            <p className="text-gray-400">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="text-blue-500 hover:text-blue-400 transition"
              >
                Sign up
              </Link>
            </p>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="hidden md:block md:w-1/2 bg-cover bg-center relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-blue-600 opacity-90"></div>
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-12">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="max-w-md text-center"
          >
            <h2 className="text-3xl font-bold mb-6">Datapolis Platform</h2>
            <p className="text-lg text-white/80 mb-8">
              Access powerful geospatial data analytics and visualization tools
              to transform your location data into actionable insights.
            </p>
            <div className="mt-10 w-full max-w-xs mx-auto">
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 5, 0],
                }}
                transition={{
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 5,
                }}
                className="relative h-64 w-64 mx-auto"
              >
                {/* This is where you might add an illustrative SVG or image */}
                <div className="absolute inset-0 bg-white/10 rounded-full"></div>
                <div className="absolute inset-4 bg-white/20 rounded-full"></div>
                <div className="absolute inset-8 bg-white/30 rounded-full"></div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
