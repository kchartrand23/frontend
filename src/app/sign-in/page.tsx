import { SignInScreen } from "@/components/auth/sign-in-screen";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In — U.S. LBM",
  description: "Sign in to access your account.",
};

export default function SignInPage() {
  return <SignInScreen />;
}
