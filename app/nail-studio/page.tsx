"use client";

import Navbar from "@/components/Navbar";
import HandAnalyzer from "@/components/HandAnalyzer";
import Footer from "@/components/Footer";

export default function NailStudioPage() {
  return (
    <main>
      <Navbar />
      <div className="pt-20">
        <HandAnalyzer />
      </div>
      <Footer />
    </main>
  );
}