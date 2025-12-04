// LandingPage.tsx
import React from "react";
import { Navbar } from "../../components/LandingPage/Navbar";
import { Hero } from "../../components/LandingPage/Hero";
import { FeatureCards } from "../../components/LandingPage/FeatureCards";
import { HowItWorks } from "../../components/LandingPage/HowItWorks";
import { CTASection } from "../../components/LandingPage/CTASection";
import { Footer } from "../../components/LandingPage/Footer";
import { Beneficios } from "../../components/LandingPage/Beneficios";

export const LandingPage: React.FC = () => {

  return(
    <main>
      <Navbar />
      <Hero />
      <FeatureCards />
      <Beneficios />
      <HowItWorks />
      <CTASection />
      <Footer />
    </main>
  );
};


export default LandingPage;
