import React from "react";
import Hero from "@/features/landing/components/hero";
import HowItWorks from "@/features/landing/components/howitwork";
import CTA from "@/features/landing/components/cta";
import * as motion from "motion/react-client";
import { AnimatePresence } from "framer-motion";
export const LandingPage = () => {
  return (
    <div className=" text-text-main selection:bg-primary selection:text-white overflow-x-hidden">
      {/* Simulate Page Transition Support */}
      <AnimatePresence mode="wait">
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}>
          <Hero />
          <HowItWorks />
          <CTA />
        </motion.main>
      </AnimatePresence>
    </div>
  );
};
