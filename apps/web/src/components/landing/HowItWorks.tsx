export default function HowItWorks() {

  return (

    <section className="px-12 py-24">

      <h2 className="text-4xl font-bold text-center mb-16">
        How COSMOS Works
      </h2>

      <div className="flex justify-center gap-10">

        <Step title="RIT Test" />
        <Step title="AI Assessment" />
        <Step title="Digital Mentor" />
        <Step title="Career Roadmap" />
        <Step title="Opportunities" />

      </div>

    </section>

  );

}

function Step({ title }: any) {
  return <div className="text-center">{title}</div>;
}