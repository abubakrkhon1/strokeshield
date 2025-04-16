"use client";
import { useScanStore } from "@/store/faceScanStore";
import { useRouter } from "next/navigation";

export default function FaceDResults() {
  const {
    asymmetry,
    eyebrowAsymmetry,
    screenshot,
    showContinue,
    phase,
    setPhase,
    setContinueVisible,
  } = useScanStore();
  const router = useRouter();

  // Compute stroke score out of 5 (2 max from each test)
  const score =
    (asymmetry >= 0.3 ? 2 : asymmetry >= 0.2 ? 1 : 0) +
    (eyebrowAsymmetry >= 0.2 ? 2 : eyebrowAsymmetry >= 0.1 ? 1 : 0);

  const assessment =
    score >= 4
      ? "⚠️ High stroke risk"
      : score >= 2
      ? "⚠️ Mild stroke indicators"
      : "✅ Low stroke risk";

  const nextPhase =
    asymmetry && !eyebrowAsymmetry
      ? "eyebrows"
      : asymmetry && eyebrowAsymmetry
      ? "voice"
      : "null";

  const nextButtonLabel =
    nextPhase === "eyebrows"
      ? "Continue to Eyebrow Scan"
      : nextPhase === "voice"
      ? "Continue to Voice Scan"
      : "";

  const handleClick = () => {
    if (phase === "smile") {
      setPhase(nextPhase);
      setContinueVisible(false);
    } else {
      router.push("/voice-scan");
      setContinueVisible(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 w-[500px] h-fit">
      <h2 className="text-xl font-bold mb-4">Detection Results</h2>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Stroke Risk</h3>
        <div className="px-4 py-2 rounded text-white font-bold text-center bg-gray-700">
          {asymmetry
            ? `Score: ${score}/5 – ${assessment}`
            : "Awaiting results..."}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="metric-card">
          <div className="metric-label">Smile Asymmetry</div>
          <div className="metric-value">
            {asymmetry ? `${(asymmetry * 100).toFixed(1)}%` : "N/A"}
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Eyebrow Asymmetry</div>
          <div className="metric-value">
            {eyebrowAsymmetry
              ? `${(eyebrowAsymmetry * 100).toFixed(1)}%`
              : "N/A"}
          </div>
        </div>
      </div>

      {screenshot && (
        <div className="mb-4">
          <img
            src={screenshot}
            alt="Captured frame"
            className="w-full rounded"
          />
        </div>
      )}

      {showContinue && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleClick}
            className="px-4 py-2 rounded font-bold bg-green-600 text-white hover:bg-green-700 transition w-fit"
          >
            {nextButtonLabel}
          </button>
        </div>
      )}
    </div>
  );
}
