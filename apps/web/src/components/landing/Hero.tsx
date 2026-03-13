import Image from "next/image";

export default function Hero() {
  return (
    <section
      className="relative grid md:grid-cols-2 gap-12 px-12 py-24 items-center text-white bg-cover bg-center"
      style={{ backgroundImage: "url('/images/space-bg.png')" }}
    >

      {/* Dark overlay */}

      <div className="absolute inset-0 bg-black/60"></div>

      {/* CONTENT */}

      <div className="relative z-10">

        <p className="text-blue-400 mb-3">
          Empowering Careers with AI & Guidance
        </p>

        <h1 className="text-6xl font-bold leading-tight mb-6">

          Your Career Journey,

          <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Smarter, Faster & Guided
          </span>

        </h1>

        <p className="text-gray-300 mb-8 max-w-xl">

          COSMOS helps students understand their potential,
          master skills, and connect with top opportunities.

        </p>

        <div className="flex gap-5">

          <button className="px-7 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90">
            Start Your Journey
          </button>

          <button className="px-7 py-3 border border-white/20 rounded-xl hover:bg-white/10">
            Explore Features
          </button>

        </div>

      </div>

      {/* IMAGE */}

      <div className="relative z-10 flex justify-center">

        <Image
          src="/images/ai-dashboard.png"
          alt="AI dashboard"
          width={600}
          height={400}
          className="rounded-2xl shadow-2xl"
        />

      </div>

    </section>
  );
}