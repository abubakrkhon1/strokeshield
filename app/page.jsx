import Header from "@/components/HeaderLanding";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex flex-1 items-center justify-center bg-white px-6 py-10">
        <div className="flex flex-col md:flex-row items-center gap-10 max-w-6xl w-full">
          {/* Left: Image */}
          <div className="w-full md:w-1/2">
            <img
              src="/hero.png"
              alt="Landing Visual"
              className="w-full h-auto rounded-lg object-cover shadow-lg"
            />
          </div>

          {/* Right: Text */}
          <div className="w-full md:w-1/2 text-left space-y-6">
            <h1 className="text-3xl md:text-4xl font-bold text-[#181111]">
              Detecting Strokes with Precision and Speed
            </h1>
            <p className="text-gray-700 text-base md:text-lg">
              Our app offers a non-invasive, swift assessment for identifying stroke risks early. Using facial and vocal analysis, we empower users with proactive health insights.
            </p>
            <a href="/face-scan" className="bg-[#e61919] text-white px-6 py-3 rounded-full font-semibold text-sm md:text-base hover:bg-red-700 transition">
              Begin Assessment
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
