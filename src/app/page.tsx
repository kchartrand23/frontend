import { LandingPage } from "@/components/landing/landing-page";
import { Suspense } from "react";

export default function Home() {
  return (
    <Suspense fallback={null}>
      <LandingPage />
    </Suspense>
  );
}
