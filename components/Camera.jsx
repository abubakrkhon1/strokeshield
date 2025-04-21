"use client";
import { useEffect, useRef, useState } from "react";
import { useScanStore } from "@/store/useScanStore";

import { loadMediaPipe, runDetectionLoop } from "@/utils/cameraScans";
import { toast } from "sonner";

export default function FaceMesh() {
  const {
    setScanResults,
    setContinueVisible,
    phase,
    setScreenshotForPhase,
    screenshots,
    setStrokeScore,
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

    await enableCam();

    let seconds = 5;
    let imageDataUrl = null;
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

          imageDataUrl = captureCanvas.toDataURL("image/png");
          setScreenshotForPhase(phase, imageDataUrl);
        }

        disableCam();
        setDisabled(true);
        toast.success(
          `${phase === "smile" ? "Smile" : "Eyebrow"} scan completed!`
        );

        // Save results from refs
        setScanResults((prev) => ({
          ...prev,
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
    <div className="w-fit h-fit bg-white rounded-lg shadow-xl p-4 flex flex-col justify-between relative">
      <div className="relative mb-4">
        {screenshots?.[phase] ? (
          <img
            src={screenshots[phase]}
            alt={`Captured frame - ${phase}`}
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
      <div className="pt-2">
        {!scanning && !disabled ? (
          <h1 className="text-2xl text-gray-700">
            No findings yet. Start detection to analyze facial asymmetry and
            posture.
          </h1>
        ) : (
          <>
            {phase === "smile" ? (
              <>
                <h1 className="text-xl mt-4 font-semibold">
                  😊 Smile Scan Hints
                </h1>
                <ul className="list-disc pl-6 text-sm text-gray-700 space-y-1">
                  <li>
                    💡 Smile gently like you're taking a passport photo - not
                    too wide, not too shy.
                  </li>
                  <li>💡 Keep your lips relaxed and show a natural smile.</li>
                  <li>
                    💡 Avoid moving your head while smiling. Stay still for best
                    detection.
                  </li>
                  <li>
                    💡 Make sure your full face is visible in the camera frame.
                  </li>
                  <li>
                    💡 Try smiling with your teeth - it helps with muscle
                    detection!
                  </li>
                  <li>
                    💡 Don't squint or tilt your head - just a straight, natural
                    smile.
                  </li>
                </ul>
              </>
            ) : (
              <>
                <h1 className="text-xl mt-4 font-semibold">
                  🤨 Eyebrow Scan Hints
                </h1>
                <ul className="list-disc pl-6 text-sm text-gray-700 space-y-1">
                  <li>
                    💡 Raise your eyebrows like you’re surprised – both at the
                    same time.
                  </li>
                  <li>
                    💡 Keep your forehead relaxed except for the eyebrow
                    movement.
                  </li>
                  <li>
                    💡 Look straight at the camera while raising your eyebrows.
                  </li>
                  <li>
                    💡 Avoid frowning or moving your mouth – just focus on the
                    eyebrows.
                  </li>
                  <li>
                    💡 Make sure your eyes and eyebrows are clearly visible in
                    good lighting.
                  </li>
                  <li>
                    💡 Try to lift both eyebrows equally to check for balance.
                  </li>
                </ul>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
