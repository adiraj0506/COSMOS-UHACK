export default function Footer() {
  return (
    <footer className="bg-[#020617] border-t border-white/10 mt-20">

      <div className="max-w-7xl mx-auto px-8 py-16 grid md:grid-cols-4 gap-12">

        {/* BRAND */}

        <div>

          <h2 className="text-2xl font-bold mb-4">
            COSMOS
          </h2>

          <p className="text-gray-400 text-sm">

            Competency Oriented Skill Mapping & Operation System.
            Helping learners build structured career growth with AI.

          </p>

        </div>

        {/* PRODUCT */}

        <div>

          <h3 className="font-semibold mb-4">
            Product
          </h3>

          <ul className="space-y-2 text-gray-400 text-sm">

            <li>AI Assessment</li>
            <li>Digital Mentor</li>
            <li>Career Roadmaps</li>
            <li>Resume Builder</li>
            <li>Opportunities</li>

          </ul>

        </div>

        {/* PLATFORM */}

        <div>

          <h3 className="font-semibold mb-4">
            Platform
          </h3>

          <ul className="space-y-2 text-gray-400 text-sm">

            <li>For Learners</li>
            <li>For Recruiters</li>
            <li>For Colleges</li>
            <li>Admin Dashboard</li>

          </ul>

        </div>

        {/* RESOURCES */}

        <div>

          <h3 className="font-semibold mb-4">
            Resources
          </h3>

          <ul className="space-y-2 text-gray-400 text-sm">

            <li>Documentation</li>
            <li>API</li>
            <li>Support</li>
            <li>Privacy Policy</li>
            <li>Terms of Service</li>

          </ul>

        </div>

      </div>

      {/* BOTTOM */}

      <div className="border-t border-white/10 py-6 text-center text-gray-500 text-sm">

        © {new Date().getFullYear()} COSMOS. All rights reserved.

      </div>

    </footer>
  );
}