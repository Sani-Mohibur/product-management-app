"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { setToken } from "@/app/lib/features/auth/authSlice";
import { loginUser } from "@/app/lib/services/authService";
import { useRouter } from "next/navigation";
import GoogleIcon from "@/app/components/GoogleIcon"; // Import the new icon

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const token = await loginUser("mohiburrahmansani@gmail.com");
      dispatch(setToken(token));
      router.push("/products");
    } catch (err) {
      setError("Login failed. Please check your email and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md rounded-lg bg-dark-space/80 p-8 shadow-2xl backdrop-blur-lg">
        <h2 className="mb-2 text-center text-xl font-semibold text-ghost-white">
          Product Management App
        </h2>
        <h1 className="mb-4 text-center text-4xl font-bold text-ghost-white">
          Login
        </h1>
        <p className="mb-6 text-center text-ghost-white/70">
          Welcome back! Please enter your email to continue.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-ghost-white"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-tan-hide/50 bg-dark-space p-3 text-ghost-white focus:border-tan-hide focus:outline-none focus:ring-1 focus:ring-tan-hide"
              placeholder="you@example.com"
              required
              disabled={isLoading}
            />
          </div>

          {/* --- New "Remember Me" Checkbox --- */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-tan-hide/50 bg-dark-space text-forest-green focus:ring-forest-green"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-ghost-white"
              >
                Remember me
              </label>
            </div>
          </div>

          {error && (
            <p className="text-center text-sm text-burnt-sienna">{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md bg-forest-green py-3 font-semibold text-ghost-white transition hover:bg-forest-green/90 focus:outline-none focus:ring-2 focus:ring-forest-green focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-forest-green/50"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* --- New Divider and Social Logins --- */}
        <div className="my-6 flex items-center justify-center">
          <div className="h-px flex-grow bg-tan-hide/30"></div>
          <span className="mx-4 flex-shrink text-sm text-ghost-white/70">
            Or continue with
          </span>
          <div className="h-px flex-grow bg-tan-hide/30"></div>
        </div>

        <div className="space-y-3">
          <button
            type="button"
            className="flex w-full items-center justify-center gap-3 rounded-md border border-ghost-white/50 bg-transparent py-2.5 font-medium text-ghost-white transition hover:bg-ghost-white/10"
          >
            <GoogleIcon className="h-5 w-5" />
            Continue with Google
          </button>
          <button
            type="button"
            className="w-full rounded-md bg-tan-hide/70 py-2.5 font-medium text-dark-space transition hover:bg-tan-hide"
          >
            Login as Guest
          </button>
        </div>

        {/* --- New Footer Links --- */}
        <div className="mt-8 text-center text-xs text-ghost-white/50">
          <p>
            By continuing, you agree to our{" "}
            <a href="#" className="underline hover:text-tan-hide">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="underline hover:text-tan-hide">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
