"use client";
import FaceDResults from "@/components/FaceDResults";
import HeaderScan from "@/components/HeaderScan";
import Sidebar from "@/components/Sidebar";
import Voice from "@/components/Voice";

export default function Home() {
  return (
    <div className="flex flex-col h-screen">
      <HeaderScan />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <div className="flex flex-col w-screen min-h-[calc(100vh-64px)] bg-gray-100 p-4 overflow-hidden">
          {/* Top Content Row */}
          <div className="flex flex-1 gap-4">
            {/* Camera Section */}
            <Voice />
          </div>
        </div>
      </div>
    </div>
  );
}
