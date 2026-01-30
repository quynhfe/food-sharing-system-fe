import React from "react";
import * as motion from "motion/react-client";
import Button from "@/components/ui/button";

const CTA: React.FC = () => {
  return (
    <section className="w-full pb-20 lg:pb-32 bg-white px-6 lg:px-[120px]">
      <div className="w-full max-w-[1440px] mx-auto">
        <motion.div
          className="relative rounded-[40px] overflow-hidden bg-[#131f16] text-white p-10 lg:p-24 flex flex-col lg:flex-row items-center justify-between gap-12 shadow-2xl"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}>
          {/* Decorative gradients */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] transform translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] transform -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

          <div className="relative z-10 max-w-2xl">
            <h2 className="text-4xl lg:text-5xl font-bold mb-8 leading-tight text-center lg:text-left">
              Ready to stop wasting food?
            </h2>
            <p className="text-gray-300 text-xl mb-10 leading-relaxed max-w-lg text-center lg:text-left mx-auto lg:mx-0">
              Join our community today and start making a positive impact on the
              environment and your neighborhood.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg">Get Started Now</Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white/20 text-white hover:bg-white/10 hover:border-white/40">
                Learn More
              </Button>
            </div>
          </div>

          <div className="relative z-10 w-full lg:w-auto flex justify-center lg:justify-end">
            <motion.div
              className="w-full max-w-[340px] aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-8 border-white/10"
              whileHover={{ rotate: 0, scale: 1.05 }}
              initial={{ rotate: 3 }}
              transition={{ type: "spring", stiffness: 100 }}>
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWUJ4TJMQPb-VE_opsk4l1wf3G07QfqS4IzCTitkHvy0qlA4pTwoK8EK036Daeb9sMnxUZmhBzrJr2B_VEzW93wpS0wJdCRvYdpEsyBnxLdWXnZNDu4oTwlwf0eZdRCude7Ix8gNXZyd5p_EB51B18IjRfazTL9oQrdScLK966GKkLX-q019-6li78JABZu7BW8TyStaGeYwdEf6XU89l2HFowOqMFcsgFxdKYw9aGlkR2I1kkwoVtMUabxhxOI68vUlDEQxz7Y0o"
                alt="Box of vegetables"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
