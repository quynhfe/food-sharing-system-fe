"use client";
import React from "react";
import { Camera, MapPin, Handshake } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { Card } from "@/components/ui/card";

const features = [
  {
    icon: <Camera size={40} />,
    title: "Post Your Food",
    description:
      "Snap a photo of your extra food, add a brief description, and set a pickup time."
  },
  {
    icon: <MapPin size={40} />,
    title: "Find Nearby",
    description:
      "Browse the map to find available food listings in your local neighborhood."
  },
  {
    icon: <Handshake size={40} />,
    title: "Connect & Share",
    description:
      "Message your neighbor to arrange a pickup and enjoy sharing good food."
  }
];

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const item: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } }
};

const HowItWorks: React.FC = () => {
  return (
    <section className="w-full py-20 lg:py-32 bg-white">
      <div className="w-full max-w-[1440px] mx-auto px-6 lg:px-[120px]">
        <div className="text-center mb-16 space-y-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl lg:text-[40px] font-bold text-text-main tracking-tight">
            How It Works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-text-secondary max-w-2xl mx-auto text-lg">
            Sharing food is simple. In just three steps, you can help your
            community and the planet.
          </motion.p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}>
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              variants={item}>
              <Card className="h-full flex flex-col items-center text-center p-8 group">
                <div className="w-24 h-24 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-text-main mb-4">
                  {feature.title}
                </h3>
                <p className="text-text-secondary leading-relaxed text-lg">
                  {feature.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
