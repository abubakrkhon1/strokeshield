"use client";
import { useEffect, useRef, useState, useCallback } from "react";

export default function Camera() {
  const [cameraActive, setCameraActive] = useState(false);
  const [faceLandmarker, setFaceLandmarker] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const requestRef = useRef(null);
  const blendShapesRef = useRef(null);
  
  // Use refs to store MediaPipe classes instead of state
  const faceLandmarkerClassRef = useRef(null);
  const drawingUtilsClassRef = useRef(null);

  // Initialize the face landmarker
  useEffect(() => {
    let isMounted = true;
    
    async function initFaceLandmarker() {
      try {
        // Dynamic import for client-side only code
        const vision = await import("@mediapipe/tasks-vision");
        const { FaceLandmarker, FilesetResolver, DrawingUtils } = vision;

        if (!isMounted) return;
        
        // Store classes in refs instead of state
        faceLandmarkerClassRef.current = FaceLandmarker;
        drawingUtilsClassRef.current = DrawingUtils;

        const filesetResolver = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );
        
        if (!isMounted) return;
        
        const landmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
            delegate: "GPU"
          },
          outputFaceBlendshapes: true,
          runningMode: "VIDEO",
          numFaces: 1
        });
        
        if (!isMounted) return;
        
        setFaceLandmarker(landmarker);
        setIsLoading(false);
        console.log("Face landmarker initialized");
      } catch (error) {
        console.error("Error initializing face landmarker:", error);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    initFaceLandmarker();

    // Cleanup
    return () => {
      isMounted = false;
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  const enableCam = async () => {
    if (!faceLandmarker) {
      console.log("Wait for face landmarker to load!");
      return;
    }

    try {
      const constraints = { 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 } 
        } 
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Only start prediction after video is fully loaded
        videoRef.current.onloadeddata = () => {
          if (videoRef.current.readyState >= 2) {
            setCameraActive(true);
            predictWebcam();
          }
        };
      }
    } catch (error) {
      console.error("Camera error:", error);
    }
  };

  const disableCam = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
      requestRef.current = null;
    }
    
    // Clear the canvas
    const canvasElement = canvasRef.current;
    if (canvasElement) {
      const ctx = canvasElement.getContext('2d');
      ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    }
    
    // Clear blend shapes
    if (blendShapesRef.current) {
      blendShapesRef.current.innerHTML = '';
    }
    
    setCameraActive(false);
  };

  const predictWebcam = useCallback(() => {
    // Check if all required elements are available
    if (!faceLandmarker || !videoRef.current || !canvasRef.current || 
        !faceLandmarkerClassRef.current || !drawingUtilsClassRef.current) {
      requestRef.current = requestAnimationFrame(predictWebcam);
      return;
    }

    const video = videoRef.current;
    
    // Make sure video is ready with dimensions
    if (!video.videoWidth || !video.videoHeight || video.readyState < 2) {
      requestRef.current = requestAnimationFrame(predictWebcam);
      return;
    }

    const canvasElement = canvasRef.current;
    
    // Set canvas dimensions to match video
    canvasElement.width = video.videoWidth;
    canvasElement.height = video.videoHeight;
    
    const canvasCtx = canvasElement.getContext('2d');
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    
    // Run face detection
    try {
      const startTimeMs = performance.now();
      const results = faceLandmarker.detectForVideo(video, startTimeMs);
      
      // Draw face landmarks if results exist
      if (results.faceLandmarks && results.faceLandmarks.length > 0) {
        // Create a new DrawingUtils instance each time
        const drawingUtils = new drawingUtilsClassRef.current(canvasCtx);
        const FaceLandmarkerClass = faceLandmarkerClassRef.current;
        
        for (const landmarks of results.faceLandmarks) {
          // Draw face mesh (tesselation)
          drawingUtils.drawConnectors(
            landmarks,
            FaceLandmarkerClass.FACE_LANDMARKS_TESSELATION,
            { color: "#C0C0C070", lineWidth: 1 }
          );
          
          // Draw the face outline
          drawingUtils.drawConnectors(
            landmarks,
            FaceLandmarkerClass.FACE_LANDMARKS_FACE_OVAL,
            { color: "#E0E0E0", lineWidth: 2 }
          );
          
          // Draw the eyes
          drawingUtils.drawConnectors(
            landmarks,
            FaceLandmarkerClass.FACE_LANDMARKS_LEFT_EYE,
            { color: "#30FF30", lineWidth: 2 }
          );
          drawingUtils.drawConnectors(
            landmarks,
            FaceLandmarkerClass.FACE_LANDMARKS_RIGHT_EYE,
            { color: "#FF3030", lineWidth: 2 }
          );
          
          // Draw eyebrows
          drawingUtils.drawConnectors(
            landmarks,
            FaceLandmarkerClass.FACE_LANDMARKS_LEFT_EYEBROW,
            { color: "#30FF30", lineWidth: 2 }
          );
          drawingUtils.drawConnectors(
            landmarks,
            FaceLandmarkerClass.FACE_LANDMARKS_RIGHT_EYEBROW,
            { color: "#FF3030", lineWidth: 2 }
          );
          
          // Draw lips
          drawingUtils.drawConnectors(
            landmarks,
            FaceLandmarkerClass.FACE_LANDMARKS_LIPS,
            { color: "#E0E0E0", lineWidth: 2 }
          );
          
          // Draw iris
          drawingUtils.drawConnectors(
            landmarks,
            FaceLandmarkerClass.FACE_LANDMARKS_RIGHT_IRIS,
            { color: "#FF3030", lineWidth: 2 }
          );
          drawingUtils.drawConnectors(
            landmarks,
            FaceLandmarkerClass.FACE_LANDMARKS_LEFT_IRIS,
            { color: "#30FF30", lineWidth: 2 }
          );
        }
      }
      
      // Draw blend shapes data
      if (results.faceBlendshapes && blendShapesRef.current) {
        drawBlendShapes(blendShapesRef.current, results.faceBlendshapes);
      }
    } catch (error) {
      console.error("Error in face detection:", error);
    }
    
    // Continue the animation loop if camera is active
    if (cameraActive) {
      requestRef.current = requestAnimationFrame(predictWebcam);
    }
  }, [faceLandmarker, cameraActive]);

  // Effect to start/stop prediction based on cameraActive state
  useEffect(() => {
    if (cameraActive) {
      predictWebcam();
    } else if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
      requestRef.current = null;
    }
  }, [cameraActive, predictWebcam]);

  // Function to display blend shapes
  function drawBlendShapes(el, blendShapes) {
    if (!blendShapes || !blendShapes.length) {
      return;
    }
    
    try {
      // Filter to only show expressions with significant values
      const significantExpressions = blendShapes[0].categories
        .filter(shape => shape.score > 0.1)
        .sort((a, b) => b.score - a.score)
        .slice(0, 8); // Top 8 expressions
      
      let htmlContent = "<h3 class='text-lg font-bold mb-2'>Face Expressions</h3>";
      
      if (significantExpressions.length === 0) {
        htmlContent += "<p class='text-gray-500 text-center'>No significant expressions detected</p>";
      } else {
        significantExpressions.forEach(shape => {
          const displayName = shape.displayName || shape.categoryName;
          const score = (shape.score * 100).toFixed(1);
          
          htmlContent += `
            <div class="mb-1">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium">${displayName}</span>
                <span class="text-sm font-semibold">${score}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2.5">
                <div class="bg-blue-600 h-2.5 rounded-full" style="width: ${score}%"></div>
              </div>
            </div>
          `;
        });
      }
      
      el.innerHTML = htmlContent;
    } catch (error) {
      console.error("Error drawing blend shapes:", error);
      el.innerHTML = "<p class='text-red-500'>Error displaying expressions</p>";
    }
  }

  return (
    <div className="w-[750px] h-fit bg-white rounded-lg shadow-xl p-4 flex flex-col justify-between relative">
      <div className="relative mb-4">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full rounded bg-gray-100"
        ></video>
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 z-10 w-full h-full"
        ></canvas>
      </div>
      
      {/* Face blend shapes display */}
      <div 
        ref={blendShapesRef}
        className="mb-4 p-3 bg-gray-50 rounded-lg min-h-[100px]"
      >
        <p className="text-gray-500 text-center">Face expression data will appear here when detection starts.</p>
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
    </div>
  );
}