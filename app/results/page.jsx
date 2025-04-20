"use client";
import HeaderScan from "@/components/HeaderScan";
import { useScanStore } from "@/store/useScanStore";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const {
    asymmetry,
    eyebrowAsymmetry,
    speechAccuracy,
    screenshots,
    audioURL,
    strokeScore,
    resetStore,
  } = useScanStore();
  const router = useRouter();

  const printRef = useRef(null);

  const handleClick = useReactToPrint({
    contentRef: printRef,
    documentTitle: "StrokeShield Results",
  });

  const handleNewTest = () => {
    resetStore();
    router.push("/face-scan");
  };

  return (
    <div className="flex flex-col h-screen">
      <HeaderScan />
      <div className="min-h-screen p-6 flex flex-col items-center">
        {/* Printable Area */}
        <div
          ref={printRef}
          className="w-full mb-4 max-w-4xl bg-white rounded-xl shadow-lg p-6 space-y-8"
        >
          <h1 className="text-3xl font-bold text-center text-gray-800">
            🧠 Stroke Detection Results
          </h1>

          {/* Smile Scan */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-700">
              😊 Smile Scan
            </h2>
            {screenshots?.smile && (
              <img
                src={screenshots.smile}
                alt="Smile screenshot"
                className="rounded shadow w-full max-h-64 p-3 object-contain"
              />
            )}
            <p className="text-gray-600">
              Asymmetry:{" "}
              <span className="font-bold text-blue-600">
                {(asymmetry * 100).toFixed(1)}%
              </span>
            </p>
          </section>

          {/* Eyebrow Scan */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-700">
              🤨 Eyebrow Scan
            </h2>
            {screenshots?.eyebrows && (
              <img
                src={screenshots.eyebrows}
                alt="Eyebrow screenshot"
                className="rounded shadow w-full p-3 max-h-64 object-contain"
              />
            )}
            <p className="text-gray-600">
              Asymmetry:{" "}
              <span className="font-bold text-blue-600">
                {(eyebrowAsymmetry * 100).toFixed(1)}%
              </span>
            </p>
          </section>

          {/* Voice Scan */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-700">
              🗣️ Voice Scan
            </h2>
            <div className="w-full bg-gray-100 p-4 rounded shadow text-sm text-gray-700">
              <p>Speech Accuracy:</p>
              <p className="text-blue-600 font-bold text-lg">
                {speechAccuracy}% Match
              </p>
              {audioURL ? <audio src={audioURL} controls /> : null}
            </div>
          </section>

          {/* Final Score */}
          <section className="pt-4 border-t">
            <p className="text-center text-gray-600 text-xl">
              🎯 Stroke Score: {strokeScore}
            </p>
          </section>
        </div>

        {/* Non-printable buttons */}
        <section className="flex mb-6 items-center justify-center gap-x-4 print:hidden">
          <button
            onClick={handleClick}
            className="cursor-pointer px-6 py-3 rounded bg-green-600 text-white font-bold hover:bg-green-700 transition"
          >
            PDF
          </button>
          <button
            onClick={handleNewTest}
            className="cursor-pointer px-6 py-3 rounded bg-blue-600 text-white font-bold hover:bg-blue-700 transition"
          >
            New Test
          </button>
        </section>
      </div>
    </div>
  );
}
