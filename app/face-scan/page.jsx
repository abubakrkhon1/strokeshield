"use client";
import Camera from "@/components/Camera";
import Sidebar from "@/components/Sidebar";
import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

export default function Home() {
  const [showContinue, setShowContinue] = useState(true);

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex flex-col w-screen min-h-[calc(100vh-64px)] bg-gray-100 p-4 overflow-hidden">
        {/* Top Content Row */}
        <div className="flex flex-1 gap-4">
          {/* Camera Section */}
          <Camera />

          {/* Results Section */}
          <div className="bg-white rounded-lg shadow-lg w-[500px] h-fit p-4">
            <h2 className="text-xl font-bold mb-4">Detection Results</h2>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Risk Assessment</h3>
              <div
                id="risk-indicator"
                className="px-4 py-2 rounded text-white font-bold text-center bg-gray-500"
              >
                Awaiting Analysis
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Asymmetry Metrics</h3>
              <div className="bg-white rounded-lg p-2 shadow-inner">
                <canvas id="metrics-chart" height="200"></canvas>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="metric-card">
                <div className="metric-label">Eye Asymmetry</div>
                <div id="eye-asymmetry" className="metric-value">
                  N/A
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Mouth Asymmetry</div>
                <div id="mouth-asymmetry" className="metric-value">
                  N/A
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Eyebrow Asymmetry</div>
                <div id="eyebrow-asymmetry" className="metric-value">
                  N/A
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Overall Asymmetry</div>
                <div id="overall-asymmetry" className="metric-value">
                  N/A
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="metric-card">
                <div className="metric-label">Shoulder Imbalance</div>
                <div id="shoulder-imbalance" className="metric-value">
                  N/A
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Head Tilt</div>
                <div id="head-tilt" className="metric-value">
                  N/A
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Body Lean</div>
                <div id="body-lean" className="metric-value">
                  N/A
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <div
          className={twMerge(
            "mt-4 flex justify-end",
            !showContinue && "hidden"
          )}
        >
          <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition cursor-pointer">
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
