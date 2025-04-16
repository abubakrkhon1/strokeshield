// MediaPipe loading function
export async function loadMediaPipe() {
  const vision = await import("@mediapipe/tasks-vision");
  const { FaceLandmarker, FilesetResolver } = vision;

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
      outputFaceBlendshapes: true,
    }
  );

  return {
    faceLandmarkerClass: FaceLandmarker,
    faceLandmarker,
  };
}

// Utility to get specific blendshape score
export function getBlendshape(name, blendshapes) {
  const match = blendshapes.categories.find((c) => c.categoryName === name);
  return match?.score || 0;
}

// Smile scan: returns { asymmetry, isSmiling }
export function smileScan(results) {
  const blendshapes = results.faceBlendshapes[0];
  const smileLeft = getBlendshape("mouthSmileLeft", blendshapes);
  const smileRight = getBlendshape("mouthSmileRight", blendshapes);

  const isSmiling = smileLeft > 0.4 && smileRight > 0.4;
  const asymmetry = Math.abs(smileLeft - smileRight);

  return { isSmiling, asymmetry };
}

// Eyebrow scan: returns { asymmetry }
export function eyebrowScan(results) {
  const blendshapes = results.faceBlendshapes[0];
  const left = getBlendshape("browOuterUpLeft", blendshapes);
  const right = getBlendshape("browOuterUpRight", blendshapes);
  const asymmetry = Math.abs(left - right);

  return { asymmetry };
}

// Continuous detection loop
export async function runDetectionLoop({
  videoRef,
  canvasRef,
  faceLandmarkerRef,
  faceLandmarkerClassRef,
  setAsymmetry,
  setIsSmiling,
  asymmetryRef,
  phase,
}) {
  if (!videoRef.current || !canvasRef.current || !faceLandmarkerRef.current) {
    requestAnimationFrame(() =>
      runDetectionLoop({
        videoRef,
        canvasRef,
        faceLandmarkerRef,
        faceLandmarkerClassRef,
        setAsymmetry,
        setIsSmiling,
        asymmetryRef,
        phase,
      })
    );
    return;
  }

  const video = videoRef.current;
  if (video.readyState < 2 || !video.videoWidth || !video.videoHeight) {
    requestAnimationFrame(() =>
      runDetectionLoop({
        videoRef,
        canvasRef,
        faceLandmarkerRef,
        faceLandmarkerClassRef,
        setAsymmetry,
        setIsSmiling,
        asymmetryRef,
        phase,
      })
    );
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

    // Draw points
    landmarks.forEach((landmark) => {
      const x = landmark.x * canvas.width;
      const y = landmark.y * canvas.height;

      ctx.beginPath();
      ctx.arc(x, y, 2, 0, 2 * Math.PI);
      ctx.fillStyle = "blue";
      ctx.fill();
    });

    const FaceLandmarkerClass = faceLandmarkerClassRef.current;
    const connections = FaceLandmarkerClass?.FACE_LANDMARKS_TESSELATION || [];

    // Draw mesh lines
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

    // Perform expression analysis
    let result;

    if (phase === "smile") {
      result = smileScan(results);
      setIsSmiling(result.isSmiling);
    } else if (phase === "eyebrows") {
      result = eyebrowScan(results);
    }

    if (result) {
      setAsymmetry(result.asymmetry);
      asymmetryRef.current = result.asymmetry;
    }
  }

  requestAnimationFrame(() =>
    runDetectionLoop({
      videoRef,
      canvasRef,
      faceLandmarkerRef,
      faceLandmarkerClassRef,
      setAsymmetry,
      setIsSmiling,
      asymmetryRef,
      phase,
    })
  );
}
