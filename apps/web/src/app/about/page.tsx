"use client";

import { motion } from "framer-motion";

export default function AboutPage() {
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
          About COSMOS
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 text-gray-300 text-lg md:text-xl"
        >
          COSMOS is a competency-driven career operating system designed to help
          learners understand, build, and showcase their skills in a structured
          and intelligent way.
        </motion.p>
      </section>

      {/* MISSION */}
      <section className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 mb-20">
        <div>
          <h2 className="text-3xl font-semibold mb-4">Our Mission</h2>
          <p className="text-gray-400 leading-relaxed">
            Traditional education focuses on marks and degrees, but the real
            world values skills and competencies. COSMOS bridges this gap by
            mapping what you know to what the industry needs.
          </p>
        </div>

        <div>
          <h2 className="text-3xl font-semibold mb-4">Our Vision</h2>
          <p className="text-gray-400 leading-relaxed">
            To become the operating system for career growth — where every
            learner has a clear path, every skill is measurable, and every
            opportunity is accessible.
          </p>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-6xl mx-auto mb-20">
        <h2 className="text-3xl font-semibold mb-10 text-center">
          What Makes COSMOS Different
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Skill Mapping",
              desc: "Break down careers into structured competencies and track your progress in real-time.",
            },
            {
              title: "AI Guidance",
              desc: "Get personalized suggestions on what to learn next based on your goals.",
            },
            {
              title: "Adaptive Assessment",
              desc: "Assessments that evolve with your level, focusing on real understanding.",
            },
            {
              title: "Career Insights",
              desc: "Understand industry demands and align your skills accordingly.",
            },
            {
              title: "Portfolio Engine",
              desc: "Showcase your skills through dynamic and verifiable profiles.",
            },
            {
              title: "For Everyone",
              desc: "Built for learners, recruiters, and institutions to connect skills with opportunities.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-lg hover:bg-white/10 transition"
            >
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-400 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHY COSMOS */}
      <section className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-semibold mb-6">Why COSMOS?</h2>
        <p className="text-gray-400 leading-relaxed text-lg">
          In a world full of information, learners often feel lost. COSMOS
          simplifies the journey by giving clarity, direction, and measurable
          growth. It’s not just a platform — it’s your personal guide to
          mastering skills and building a meaningful career.
        </p>
      </section>
    </div>
  );
}