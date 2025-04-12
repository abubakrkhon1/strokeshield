"use client";
import { useEffect, useRef, useState } from "react";
import {
  loadMediaPipe,
  runDetectionLoop,
} from "@/utils/cameraScans";

export default function FaceMesh() {
  const [cameraActive, setCameraActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Variables for MediaPipe
  const faceLandmarkerRef = useRef(null);
  const faceLandmarkerClassRef = useRef(null);

  // Camera and face mesh variables
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Smile scan variables
  const [asymmetry, setAsymmetry] = useState(0);
  const [isSmiling, setIsSmiling] = useState("false");
  const [verdict, setVerdict] = useState("No verdict yet!");

  // Loading MediaPipe
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const { faceLandmarkerClass, faceLandmarker } = await loadMediaPipe();
        faceLandmarkerClassRef.current = faceLandmarkerClass;
        faceLandmarkerRef.current = faceLandmarker;
      } catch (err) {
        console.error("Failed to load MediaPipe:", err);
      }
      setIsLoading(false);
    };

    load();
  }, []);

  const enableCam = async () => {
    try {
      const camera = await navigator.mediaDevices.getUserMedia({ video: true });

      if (videoRef.current) {
        videoRef.current.srcObject = camera;

        videoRef.current.onloadedmetadata = () => {
          runDetectionLoop({
            videoRef,
            canvasRef,
            faceLandmarkerRef,
            faceLandmarkerClassRef,
            setAsymmetry,
            setIsSmiling,
            setVerdict,
          });
        };
      }

      setCameraActive(true);
    } catch (error) {
      console.log("Error accessing camera!");
    }
  };

  const disableCam = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setCameraActive(false);

      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext("2d");
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
  };

  return (
    <div className="w-[750px] h-fit bg-white rounded-lg shadow-xl p-4 flex flex-col justify-between relative">
      <div className="relative mb-4">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full rounded bg-gray-100 object-contain"
        ></video>
        <canvas
          ref={canvasRef}
          className="absolute top-0 bottom-0 h-full w-full pointer-events-none"
        />
      </div>

      {/* Control buttons */}
      <div className="flex gap-4">
        {cameraActive ? (
          <button
            onClick={disableCam}
            className="px-4 py-2 rounded font-bold bg-red-600 text-white hover:bg-red-700 transition flex-1"
          >
            Stop Face Mesh
          </button>
        ) : (
          <button
            onClick={enableCam}
            className="px-4 py-2 rounded font-bold bg-blue-600 text-white hover:bg-blue-700 transition flex-1"
            disabled={isLoading}
          >
            {isLoading ? "Loading MediaPipe..." : "Start Face Mesh"}
          </button>
        )}
      </div>
      <div className="pt-4">
        <h3 className="text-lg font-semibold mb-2">Key Findings</h3>
        <ul id="findings-list" className="list-disc pl-5">
          <li>
            No findings yet. Start detection to analyze facial asymmetry and
            posture.
          </li>
          <li>Asymmetry: {asymmetry}</li>
          <li>Verdict: {verdict}</li>
        </ul>
      </div>
    </div>
  );
}
