"use client";
import HeaderScan from "@/components/HeaderScan";

export default function Home() {
  return (
    <div className="flex flex-col h-screen">
      <HeaderScan />
      <div className="flex flex-1 items-center justify-center overflow-hidden">
        Results
      </div>
    </div>
  );
}
