"use client";
import { useEffect, useRef, useState } from "react";

export default function FaceMesh() {
  const [cameraActive, setCameraActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const faceLandmarkerRef = useRef(null);
  const faceLandmarkerClassRef = useRef(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    async function loadMediaPipe() {
      setIsLoading(true);
      const vision = await import("@mediapipe/tasks-vision");

      const { FaceLandmarker, FilesetResolver } = vision;

      faceLandmarkerClassRef.current = FaceLandmarker;

      const filesetResolver = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );

      const faceLandmarker = await FaceLandmarker.createFromOptions(
        filesetResolver,
        {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numFaces: 1,
        }
      );

      faceLandmarkerRef.current = faceLandmarker;
      setIsLoading(false);
    }

    loadMediaPipe();
  }, []);

  const runDetectionLoop = async () => {
    if (!videoRef.current || !canvasRef.current || !faceLandmarkerRef.current) {
      requestAnimationFrame(runDetectionLoop);
      return;
    }

    const video = videoRef.current;

    if (video.readyState < 2 || !video.videoWidth || !video.videoHeight) {
      requestAnimationFrame(runDetectionLoop);
      return;
    }

    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const results = await faceLandmarkerRef.current.detectForVideo(
      video,
      performance.now()
    );

    if (results.faceLandmarks && results.faceLandmarks.length > 0) {
      const landmarks = results.faceLandmarks[0];

      landmarks.forEach((landmark) => {
        const x = landmark.x * canvas.width;
        const y = landmark.y * canvas.height;

        ctx.beginPath();
        ctx.arc(x, y, 2, 0, 2 * Math.PI);
        ctx.fillStyle = "blue";
        ctx.fill();
      });

      const FaceLandmarkerClass = faceLandmarkerClassRef.current;

      const connections = FaceLandmarkerClass
        ? FaceLandmarkerClass.FACE_LANDMARKS_TESSELATION
        : [];

      connections.forEach((connection) => {
        const start = landmarks[connection.start];
        const end = landmarks[connection.end];

        const x1 = start.x * canvas.width;
        const y1 = start.y * canvas.height;
        const x2 = end.x * canvas.width;
        const y2 = end.y * canvas.height;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = "rgb(235, 235, 235)";
        ctx.lineWidth = 1;
        ctx.stroke();
      });
    } else {
      console.log("No face detected!");
    }

    requestAnimationFrame(runDetectionLoop);
  };

  const enableCam = async () => {
    try {
      const camera = await navigator.mediaDevices.getUserMedia({ video: true });

      if (videoRef.current) {
        videoRef.current.srcObject = camera;

        videoRef.current.onloadedmetadata = () => {
          console.log(
            "Video loaded, dimensions:",
            videoRef.current.videoWidth,
            videoRef.current.videoHeight
          );

          if (faceLandmarkerRef.current) {
            runDetectionLoop();
          }
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
        </ul>
      </div>
    </div>
  );
}
