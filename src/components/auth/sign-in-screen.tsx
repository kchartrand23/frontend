"use client";

import { FormEvent, useId, useState } from "react";
import { UsLbmLogo } from "@/components/auth/us-lbm-logo";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;
const MAX_EMAIL_LENGTH = 254;
const MAX_PASSWORD_LENGTH = 128;

function sanitizeEmail(value: string): string {
  return value.trim().slice(0, MAX_EMAIL_LENGTH);
}

export function SignInScreen() {
  const emailId = useId();
  const passwordId = useId();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    const normalizedEmail = sanitizeEmail(email);
    if (!normalizedEmail || !EMAIL_PATTERN.test(normalizedEmail)) {
      setFormError("Enter a valid email address.");
      return;
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      setFormError("Password must be at least 8 characters.");
      return;
    }

    if (password.length > MAX_PASSWORD_LENGTH) {
      setFormError("Password is too long.");
      return;
    }

    setFormError(
      "Sign-in is not connected yet. This screen is for layout preview only.",
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#1a2744] px-4 py-10">
      <div className="w-full max-w-[420px] rounded-2xl bg-white px-8 py-10 shadow-xl sm:px-10 sm:py-12">
        <UsLbmLogo className="h-14 w-auto" />

        <h1 className="mt-8 text-3xl font-bold tracking-tight text-zinc-900">
          Sign In
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          Enter your credentials to access your account
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
          <div>
            <label
              htmlFor={emailId}
              className="block text-sm font-semibold text-zinc-800"
            >
              Email Address
            </label>
            <input
              id={emailId}
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              value={email}
              onChange={(e) => setEmail(sanitizeEmail(e.target.value))}
              maxLength={MAX_EMAIL_LENGTH}
              className="mt-2 w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-[#1a2744]/50 focus:ring-2 focus:ring-[#1a2744]/15"
              placeholder="john.smith@gmail.com"
            />
          </div>

          <div>
            <label
              htmlFor={passwordId}
              className="block text-sm font-semibold text-zinc-800"
            >
              Password
            </label>
            <div className="relative mt-2">
              <input
                id={passwordId}
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value.slice(0, MAX_PASSWORD_LENGTH))
                }
                maxLength={MAX_PASSWORD_LENGTH}
                className="w-full rounded-lg border border-zinc-200 py-2.5 pl-3 pr-10 text-sm text-zinc-900 outline-none focus:border-[#1a2744]/50 focus:ring-2 focus:ring-[#1a2744]/15"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-zinc-400 hover:text-zinc-600"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.75}
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858 3.03a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.75}
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
            <p className="mt-1.5 text-xs text-zinc-400">
              Minimum 8 characters
            </p>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              className="text-sm font-medium text-[#1a2744] underline underline-offset-2 hover:text-[#152038]"
            >
              Forgot Password?
            </button>
          </div>

          {formError && (
            <p
              className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
              role="alert"
            >
              {formError}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-[#1a2744] py-3 text-sm font-semibold text-white transition hover:bg-[#152038] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1a2744]"
          >
            Continue
          </button>
        </form>

        <p className="mt-10 text-center text-xs text-zinc-400">
          © 2026 US LBM Holdings, LLC. All rights Reserved
        </p>
      </div>
    </div>
  );
}
