"use client";
import Header from "@/components/HeaderLanding";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex flex-1 flex-col items-center justify-center bg-white px-6 py-10 text-gray-800">
        <h1 className="text-4xl font-bold mb-6 text-center text-blue-700">
          How StrokeShield Works
        </h1>

        <div className="max-w-3xl space-y-8 text-lg leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold mb-2">1️⃣ Smile Detection</h2>
            <p>
              Using your camera, StrokeShield analyzes your smile to detect any asymmetry in facial muscles.
              Facial asymmetry can be a key early indicator of stroke, and our AI model measures this in real time.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">2️⃣ Eyebrow Movement</h2>
            <p>
              Next, the app asks you to raise your eyebrows. It scans for evenness and muscle coordination between both sides of your face.
              Any abnormal movement patterns are recorded and analyzed.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">3️⃣ Voice Analysis</h2>
            <p>
              Stroke can affect speech clarity. You’ll be prompted to read a short sentence out loud, and our system will analyze your
              speech accuracy using transcription and comparison tools to detect any speech impairment.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">4️⃣ Instant Results</h2>
            <p>
              After completing all three scans, StrokeShield generates a risk score and a detailed summary including facial asymmetry percentages,
              audio playback of your speech, and a recommendation to seek help if signs are detected.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">🔒 Privacy & Safety</h2>
            <p>
              Your scans are processed securely and never stored without your consent. StrokeShield is designed to be fast, accurate, and private.
              Always consult a medical professional if you’re experiencing symptoms.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
