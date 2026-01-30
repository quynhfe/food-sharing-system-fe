"use client";
import React from "react";
import * as motion from "motion/react-client";
import { PlusCircle, Search, Star, Leaf } from "lucide-react";
import Button from "@/components/ui/button";

const Hero: React.FC = () => {
  return (
    <section className="relative w-full min-h-[calc(100vh-80px)] flex items-center bg-gradient-to-b from-[#e8f8ed] to-white overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[50%] h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />

      <div className="w-full max-w-[1440px] mx-auto px-6 lg:px-[120px]  lg:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            className="lg:col-span-7 flex flex-col gap-8 text-center lg:text-left order-2 lg:order-1"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}>
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-[64px] leading-[1.1] font-bold text-text-main tracking-tight">
                Share Food, <br />
                <span className="text-primary">Share Love</span>
              </h1>
              <p className="text-lg sm:text-xl text-text-secondary font-normal max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Connect with your community to reduce food waste. Join thousands
                of neighbors making a difference, one meal at a time.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
              <Button
                size="lg"
                leftIcon={<PlusCircle size={24} />}>
                Post Food
              </Button>
              <Button
                variant="outline"
                size="lg"
                leftIcon={<Search size={24} />}>
                Find Food
              </Button>
            </div>

            {/* Social Proof */}
            <div className="pt-6 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6 text-sm text-text-secondary">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-3 overflow-hidden">
                  {[
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuCc84RcddKuyEHQYCw4F-zUoDjGhTF2VO6JEYIk-WHERqnB_YxUjvGRNZrEtsNPJcaTCMVJ5Uvzb9bHjWcpCljV-C0AdFps4O_-tFT3D0OnSTLJuThojMW3Q91q1IVcgbux8oAwV_dDZLdnYNsBPxYgmYE1vA2R8byuu_YfpfLw5po7Jh-EOzvnvz4WX32T0FzHhlC2SvyyWvEsJBOG4E4wgNg_CPyfhtE_SZvlP9ihjmxrQJZMb9l6yRZLrN6sdbDC1aPXkeb-g0k",
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuD9gxOuEyaRNbUHtFwLy_z80ye1Dk8rZ_tt20smPVnm-SO0u3y88pCXfbyhElOJPo9pNxiO6XtLp5ty0I-YMCAnK37doMI0CU7qhtNef-XeYXhjv1cneevVQvo51aSJj7WMgGcQdEY5cqJy6pcl6ROCSj_-Vw5rI_r_fDInCPk9NRvcYQm3YjyIUqwM1dI2DeMvhw3vQv7Y8H5ke0VKKkYFYSv9h8LbnCbZHcTjlJ0tDeHrFlDZyM9TsEtww75z6O9rVWbVry3VTPw",
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuAeQvSsbZpDGTtVBskQp4zfRoe73VGE8Qcyu6EXl_rBTyg2_QKRPOAMckTSSg0Ej13ibHGKd2beYLAovs4n2POCivRV_1-WbsY7ZaO6pr76CEoEVGry-gP1uHFy-w4fSyZEN6q4jAVlp6-cAZwIRZsV2zfnK6IQj-19oZeD8uP2kVYIehDBKWQmqwndM4lpTve2XMMURYrmjW3-Rc9R4OvfcmU47LSNAhclzbqcl5UWuquBi2w_B8m_El7dix2czgRF7t_SgeQAyMg"
                  ].map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt="Neighbor"
                      className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover"
                    />
                  ))}
                </div>
                <span className="font-semibold text-text-main ml-2">
                  10k+ Neighbors
                </span>
              </div>
              <div className="hidden sm:block w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
              <div className="flex items-center gap-1">
                <div className="bg-yellow-100 p-1 rounded-full text-yellow-600">
                  <Star
                    size={14}
                    fill="currentColor"
                  />
                </div>
                <span className="font-semibold text-text-main">
                  4.9/5 Rating
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            className="lg:col-span-5 relative order-1 lg:order-2 mb-8 lg:mb-0"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}>
            <div className="relative w-full aspect-square max-w-[400px] lg:max-w-[500px] mx-auto">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl transform -translate-y-4 scale-90"></div>
              <motion.div
                className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white h-full"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.4 }}>
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQHmYrrWfWKu9ilOUa79p-EikmEftDi9h4eV5oloCWKcjAJMgxqo8soZ7lblu3tXHMzyU9aUWLJ5ttTtARoCCSs01KjxMJyWyQwuzMnqDMIlwI2v5ocoE3j-s6u5s_vw0M-fau4nicT83le89OdirtkU9LA9PWHeVPRTXnZZx61z3kmgdYddBXQuP0nKzpAsLJgqzA5bJW9TOgUdNksI3IDkOLMsK7FhLMG1RozLLLgKN71hR0E3Ygo-lEaPVtzvnYAMZhCcVZfUQ"
                  alt="Community Garden"
                  className="w-full h-full object-cover"
                />
              </motion.div>

              {/* Floating Badge */}
              <motion.div
                className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-4 max-w-[200px]"
                animate={{ y: [0, -10, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 4,
                  ease: "easeInOut"
                }}>
                <div className="bg-green-100 p-3 rounded-xl text-primary">
                  <Leaf
                    size={24}
                    fill="currentColor"
                  />
                </div>
                <div>
                  <p className="text-xs text-text-secondary font-medium uppercase tracking-wide">
                    Saved today
                  </p>
                  <p className="text-xl font-bold text-text-main">1,240 kg</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
