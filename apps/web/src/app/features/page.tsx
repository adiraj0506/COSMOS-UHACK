"use client";

import { motion } from "framer-motion";

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-black text-white px-6 md:px-12 pt-32 pb-20">
      {/* HERO */}
      <section className="max-w-5xl mx-auto text-center mb-20">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
        >
          Features of COSMOS
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 text-gray-300 text-lg md:text-xl"
        >
          Everything you need to map, build, and showcase your skills — powered by intelligence.
        </motion.p>
      </section>

      {/* FEATURES GRID */}
      <section className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 mb-20">
        {[
          {
            title: "Competency Mapping",
            desc: "Structured breakdown of skills required for different career paths.",
          },
          {
            title: "Skill Gap Analysis",
            desc: "Identify what you’re missing and get clear next steps.",
          },
          {
            title: "AI Learning Paths",
            desc: "Personalized roadmap based on your goals and progress.",
          },
          {
            title: "Adaptive Assessments",
            desc: "Dynamic tests that adjust difficulty based on your performance.",
          },
          {
            title: "Real-time Progress Tracking",
            desc: "Visual dashboards to monitor growth across competencies.",
          },
          {
            title: "Career Insights",
            desc: "Stay aligned with industry trends and job requirements.",
          },
          {
            title: "Portfolio Builder",
            desc: "Showcase your verified skills and projects effectively.",
          },
          {
            title: "Recruiter Connect",
            desc: "Bridge the gap between talent and opportunity.",
          },
          {
            title: "College Integration",
            desc: "Empower institutions to track and improve student outcomes.",
          },
        ].map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-lg hover:bg-white/10 transition"
          >
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-400 text-sm">{feature.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* CTA */}
      <section className="text-center max-w-3xl mx-auto">
        <h2 className="text-3xl font-semibold mb-4">
          Ready to take control of your career?
        </h2>
        <p className="text-gray-400 mb-6">
          Start building your skill universe with COSMOS today.
        </p>

        <a
          href="/signup"
          className="inline-block px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-105 transition shadow-lg shadow-blue-500/30"
        >
          Get Started →
        </a>
      </section>
    </div>
  );
}