
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import FeatureStrip from "@/components/landing/FeatureStrip";
import FeaturesGrid from "@/components/landing/FeaturesGrid";
import HowItWorks from "@/components/landing/HowItWorks";
//import UsersSection from "@/components/landing/UsersSection";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="text-white">

      <Navbar />

      <Hero />

      <FeatureStrip />

      <FeaturesGrid />

      <HowItWorks />

      {/* <UsersSection /> */}

      <Footer />

    </main>
  );
}