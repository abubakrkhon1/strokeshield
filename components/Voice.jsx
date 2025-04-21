"use client";
import { useScanStore } from "@/store/useScanStore";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";

export default function VoiceScanPage() {
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audiourl, setAudiourl] = useState(null);
  const mediaRecorderRef = useRef(null);

  const audioChunksRef = useRef([]);
  const transcribedText = useRef(null);

  const router = useRouter();

  const { setSpeechAccuracy, setAudioURL } = useScanStore();

  const promptText = "Today is a sunny day. I feel great and ready to go.";

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });

        const file = new File([audioBlob], "recording.webm", {
          type: "audio/webm",
        });

        const formData = new FormData();
        formData.append("file", file);

        // Send to API route
        setLoading(true);
        const res = await fetch("/api/transcribe", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        transcribedText.current = data.text;

        const accuracy = calculateAccuracy(promptText, data.text);

        setSpeechAccuracy(accuracy);
        setLoading(false);

        const url = URL.createObjectURL(audioBlob);
        setAudiourl(url);
        setAudioURL(url);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);

      setTimeout(() => {
        mediaRecorderRef.current.stop();
        setIsRecording(false);

        mediaRecorderRef.current.stream
          ?.getTracks()
          .forEach((track) => track.stop());
      }, 5000);
    } catch (err) {
      console.error("Microphone access error:", err);
    }
  };

  function calculateAccuracy(prompt, transcript) {
    const promptWords = prompt.toLowerCase().split(/\s+/);
    const transcriptWords = transcript.toLowerCase().split(/\s+/);

    const correctWords = promptWords.filter(
      (word, i) => word === transcriptWords[i]
    );
    const accuracy = (correctWords.length / promptWords.length) * 100;

    return accuracy.toFixed(1); // % score with 1 decimal
  }

  return (
    <div className="flex-1 bg-[#f5f5f5] flex flex-col items-center justify-center px-4 relative">
      <h1 className="text-2xl font-bold mb-4 text-center">🗣️ Voice Scan</h1>
      <p className="text-lg text-center max-w-md mb-8">
        Please read the following sentence clearly:
      </p>
      <div className="bg-white rounded-lg p-6 shadow-lg mb-6 text-center max-w-lg ">
        <span className="text-xl font-semibold text-gray-800">
          {promptText}
        </span>
      </div>

      <button
        onClick={startRecording}
        disabled={isRecording}
        className="cursor-pointer px-6 py-3 rounded bg-blue-600 text-white font-bold hover:bg-blue-700 transition disabled:bg-gray-400"
      >
        {isRecording
          ? "Recording..."
          : loading
          ? "Transcribing..."
          : "Start Recording"}
      </button>

      {loading ? (
        <div className="mt-4 text-blue-600 font-semibold animate-pulse">
          🔍 Transcribing your voice...
        </div>
      ) : (
        transcribedText.current && (
          <div className="mt-4 text-blue-600 font-semibold">
            Transcribed text: {transcribedText.current}
          </div>
        )
      )}

      {audiourl && (
        <div className="mt-6">
          <p className="text-sm text-gray-600 text-center mb-2">
            Recording complete:
          </p>
          <audio controls src={audiourl} />
        </div>
      )}

      <button
        onClick={() => router.push("/results")}
        disabled={isRecording}
        className={
          !transcribedText.current
            ? `hidden`
            : `cursor-pointer absolute bottom-3 right-3 px-6 py-3 rounded bg-blue-600 text-white font-bold hover:bg-blue-700 transition disabled:bg-gray-400`
        }
      >
        Continue to Results
      </button>
    </div>
  );
}
