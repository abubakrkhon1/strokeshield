"use client";
import Header from "@/components/HeaderLanding";

export default function FAQPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex flex-1 flex-col items-center justify-center bg-white px-6 py-10 text-gray-800">
        <h1 className="text-4xl font-bold mb-8 text-center text-blue-700">
          🧠 StrokeShield FAQ
        </h1>

        <div className="max-w-3xl w-full space-y-8 text-lg">
          <div>
            <h2 className="text-xl font-semibold mb-2">❓ What is StrokeShield?</h2>
            <p>
              StrokeShield is a web-based early detection tool that analyzes facial and speech patterns to identify potential signs of a stroke.
              It uses AI to scan for asymmetry in facial movements and irregularities in speech.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">📷 Do I need a camera and microphone?</h2>
            <p>
              Yes. StrokeShield requires access to your device’s camera and microphone to perform facial scans and voice analysis.
              All processing is done securely, and your media is not stored without your permission.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">⏱️ How long does the scan take?</h2>
            <p>
              Each phase of the scan (smile, eyebrows, voice) takes about 5–10 seconds. The full scan process is usually completed in under a minute.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">🩺 Can this diagnose a stroke?</h2>
            <p>
              No. StrokeShield is not a diagnostic tool. It provides a risk score and signs for informational purposes only.
              Always consult a medical professional for an official diagnosis or if you're experiencing symptoms.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">🔒 Is my data stored or shared?</h2>
            <p>
              No. Your scan data is processed in real time and is not stored on our servers unless explicitly allowed by you.
              We value your privacy and follow best practices for data protection.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">📄 Can I download my results?</h2>
            <p>
              Yes! After completing a scan, you can download a PDF version of your results, including screenshots and analysis scores.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">🌐 Does it work on all devices?</h2>
            <p>
              StrokeShield is optimized for modern browsers and works on desktops, laptops, tablets, and most smartphones with a camera and mic.
              For best results, use Chrome or Safari on a stable internet connection.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
