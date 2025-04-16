"use client";
import { useEffect, useRef, useState } from "react";
import { useScanStore } from "@/store/faceScanStore";

import { loadMediaPipe, runDetectionLoop } from "@/utils/cameraScans";

export default function FaceMesh() {
  const {
    setScanResults,
    setContinueVisible,
    phase,
    setScreenshot,
    screenshot,
  } = useScanStore();

  const [disabled, setDisabled] = useState(false);
  const completedPhasesRef = useRef({
    smile: false,
    eyebrows: false,
  });

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
        console.log(phase);

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
            phase,
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
    completedPhasesRef.current[phase] = true;
    setDisabled(true);
    setCountdown(10);
    setScanning(true);
    setScreenshot(null); // clear previous screenshot

    await enableCam();

    let seconds = 10;
    const interval = setInterval(() => {
      seconds -= 1;
      setCountdown(seconds);
      if (seconds === 0) {
        clearInterval(interval);
        setScanning(false);

        const video = videoRef.current;
        if (video && video.videoWidth > 0) {
          const captureCanvas = document.createElement("canvas");
          captureCanvas.width = video.videoWidth;
          captureCanvas.height = video.videoHeight;

          const ctx = captureCanvas.getContext("2d");
          ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

          const imageDataUrl = captureCanvas.toDataURL("image/png");
          setScreenshot(imageDataUrl);
        }

        disableCam();
        setDisabled(true);

        // Save results from refs
        setScanResults((prev) => ({
          ...prev,
          screenshot: screenshot,
          ...(phase === "smile"
            ? {
                asymmetry: asymmetryRef.current,
              }
            : {
                eyebrowAsymmetry: asymmetryRef.current,
              }),
        }));

        setContinueVisible(true); // show continue button
      }
    }, 1000);
  };

  useEffect(() => {
    if (!completedPhasesRef.current[phase]) {
      setDisabled(false);
    }
  }, [phase]);

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
            className="px-4 py-2 rounded font-bold bg-green-600 text-white hover:bg-green-700 transition w-full mt-2 disabled:bg-neutral-300"
            disabled={isLoading || cameraActive || disabled}
          >
            {phase === "smile"
              ? "Scan Face for smile for 10 seconds"
              : "Scan Face for eyebrows for 10 seconds"}
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
          <li className={asymmetry && verdict && `hidden`}>
            No findings yet. Start detection to analyze facial asymmetry and
            posture.
          </li>
          {phase === "smile" ? (
            <>
              <li>Smile Asymmetry: {asymmetry}</li>
              <li>Verdict: {verdict}</li>
            </>
          ) : (
            <>
              <li>Eyebrow Asymmetry: {asymmetry}</li>
              <li>Verdict: {verdict}</li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}
