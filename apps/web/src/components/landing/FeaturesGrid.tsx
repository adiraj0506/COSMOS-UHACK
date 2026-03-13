export default function FeaturesGrid() {

  return (

    <section className="px-12 pb-24">

      <h2 className="text-center text-4xl font-bold mb-4">
        Everything You Need to Succeed
      </h2>

      <div className="grid md:grid-cols-5 gap-6">

        <Card title="Career Readiness" />
        <Card title="Roadmap Builder" />
        <Card title="Digital Mentor" />
        <Card title="Resume Optimizer" />
        <Card title="Opportunities" />

      </div>

    </section>

  );

}

function Card({ title }: any) {

  return (

    <div className="p-6 bg-white/5 border border-white/10 rounded-xl">

      <h3 className="font-semibold">{title}</h3>

    </div>

  );

}