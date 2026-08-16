"use client";

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
import FAQ from "@/components/landing/FAQ";

export default function Home() {
  const router = useRouter();

  // =========================
  // Navigation
  // =========================
  const handleCreateEvent = () => {
    router.push("/dashboard/events/new");
  };

  const handleViewPlans = () => {
    router.push("/plan");
  };

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <Header onCreateEvent={handleCreateEvent} />

      <Hero onCreateEvent={handleCreateEvent} />

      <Problem />

      <Solution />

      <HowItWorks />

      <Product />

      <Pricing onViewPlans={handleViewPlans} />

      <FAQ />

      <GuestEntry />

      <FinalCta onCreateEvent={handleCreateEvent} />

      <Footer />

    </main>
  );
}