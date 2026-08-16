"use client";

import { Check } from "lucide-react";
import { useRouter } from "next/navigation";

// components
import Hero from "@/components/landing/Hero";
import Problem from "@/components/landing/Problem";
import Solution from "@/components/landing/Solution";
import HowItWorks from "@/components/landing/HowItWorks";
import Product from "@/components/landing/Product";
import Pricing from "@/components/landing/Pricing";
import GuestEntry from "@/components/landing/GuestEntry";
import FinalCta from "@/components/landing/FinalCta";
import Footer from "@/components/landing/Footer";
import Header from "@/components/landing/Header";

export default function Home() {
  const router = useRouter();

  // =========================
  // Navigation
  // =========================
  const handleCreateEvent = () => {
    router.push("/dashboard/events/new");
  };

  const handleLogin = () => {
    router.push("/login");
  };

  const handleSignup = () => {
    router.push("/signup");
  };

  const handleDashboard = () => {
    router.push("/dashboard");
  };

  const handleAccount = () => {
    router.push("/account");
  };

  const handleViewPlans = () => {
    router.push("/plan");
  };

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <Header />

      <Hero onCreateEvent={handleCreateEvent} />

      <Problem />

      <Solution />

      <HowItWorks />

      <Product />

      <Pricing onViewPlans={handleViewPlans} />

      <GuestEntry />

      <FinalCta onCreateEvent={handleCreateEvent} />

      <Footer />

    </main>
  );
}

/* =========================
   Components
========================= */

function ProblemCard({ text }: { text: string }) {
  return (
    <div className="rounded-2xl bg-white px-5 py-5 text-left shadow-sm">
      <p className="text-sm text-gray-600">
        {text}
      </p>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-7 text-center shadow-sm">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50">
        {icon}
      </div>

      <h3 className="mt-5 text-sm font-bold">
        {title}
      </h3>

      <p className="mt-2 text-xs leading-6 text-gray-500">
        {description}
      </p>
    </div>
  );
}

function Step({
  number,
  title,
}: {
  number: string;
  title: string;
}) {
  return (
    <div className="relative text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white text-sm font-bold shadow-sm ring-1 ring-gray-100">
        {number}
      </div>

      <h3 className="mt-5 text-sm font-bold">
        {title}
      </h3>
    </div>
  );
}