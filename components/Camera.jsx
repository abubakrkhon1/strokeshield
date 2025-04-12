"use client";
import { useEffect, useRef, useState } from "react";
import { useScanStore } from "@/store/faceScanStore";

import { loadMediaPipe, runDetectionLoop } from "@/utils/cameraScans";

export default function FaceMesh() {
  const { setScanResults } = useScanStore();

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
  const asymmetryRef = useRef(0);
  const verdictRef = useRef("No verdict yet!");

  const [scanning, setScanning] = useState(false);
  const [countdown, setCountdown] = useState(10);

  const [screenshot, setScreenshot] = useState(null);

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
            asymmetryRef,
            verdictRef,
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

  const startScan = async () => {
    setCountdown(10);
    setScanning(true);

    await enableCam();

    let seconds = 10;
    const interval = setInterval(() => {
      seconds -= 1;
      setCountdown(seconds);
      if (seconds === 0) {
        clearInterval(interval);
        setScanning(false);

        // Take screenshot BEFORE disabling camera
        const video = videoRef.current;
        if (video && video.videoWidth > 0) {
          try {
            const captureCanvas = document.createElement("canvas");
            captureCanvas.width = video.videoWidth;
            captureCanvas.height = video.videoHeight;

            const ctx = captureCanvas.getContext("2d");
            ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

            const imageDataUrl = captureCanvas.toDataURL("image/png");
            setScreenshot(imageDataUrl);
            console.log("Screenshot captured successfully");
          } catch (error) {
            console.error("Error capturing screenshot:", error);
          }
        } else {
          console.error("Video element not ready for screenshot");
        }

        setScanResults({
          asymmetry: asymmetryRef.current,
          verdict: verdictRef.current,
          canContinue: true
        });

        disableCam();
      }
    }, 1000);
  };

  return (
    <div className="w-[750px] h-fit bg-white rounded-lg shadow-xl p-4 flex flex-col justify-between relative">
      <div className="relative mb-4">
        {screenshot ? (
          <img
            src={screenshot}
            alt="Captured frame"
            className="w-full h-full rounded object-contain"
          />
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full rounded bg-gray-100 object-contain"
          />
        )}
        <canvas
          ref={canvasRef}
          className="absolute top-0 bottom-0 h-full w-full pointer-events-none"
        />
      </div>

      {/* Control buttons */}
      <div className="flex gap-4">
        {!scanning ? (
          <button
            onClick={startScan}
            className="px-4 py-2 rounded font-bold bg-green-600 text-white hover:bg-green-700 transition w-full mt-2"
            disabled={isLoading || cameraActive}
          >
            Scan Face for 10 seconds
          </button>
        ) : (
          <div className="text-center text-sm mt-2 text-gray-600">
            Scanning... ⏳ {countdown}s remaining
          </div>
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
