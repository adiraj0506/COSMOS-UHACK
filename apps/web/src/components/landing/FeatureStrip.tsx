import { Brain, Map, Bot, Briefcase, FileText } from "lucide-react";

export default function FeatureStrip() {

  return (

    <section className="px-12 pb-16">

      <div className="grid md:grid-cols-5 gap-6 p-6 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">

        <Feature icon={<Brain />} text="AI Assessments" />
        <Feature icon={<Map />} text="Personalized Roadmaps" />
        <Feature icon={<Bot />} text="Digital Mentorship" />
        <Feature icon={<Briefcase />} text="Top Recruiters" />
        <Feature icon={<FileText />} text="Placement Support" />

      </div>

    </section>

  );

}

function Feature({ icon, text }: any) {
  return (
    <div className="flex items-center gap-3 justify-center">
      {icon}
      {text}
    </div>
  );
}