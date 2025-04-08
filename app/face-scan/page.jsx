"use client";
import Camera from "@/components/Camera";
import FaceDResults from "@/components/FaceDResults";
import Sidebar from "@/components/Sidebar";
import { useState } from "react";
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
          <FaceDResults />
        </div>
      </div>
    </div>
  );
}
