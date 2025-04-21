"use client";

import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";

export default function Header() {
  const { user } = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.refresh();
  };

  return (
    <header className="flex items-center justify-between border-b border-[#f4f0f0] px-6 py-3 w-full">
      {/* Logo */}
      <div className="flex items-center text-[#181111]">
        <a href="/" className="w-fit h-10 flex items-center justify-center">
          <img
            src="/logo.png"
            alt="StrokeShield Logo"
            className="h-full object-contain"
          />
          <h2 className="ml-2 text-lg font-bold">StrokeShield</h2>
        </a>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-8">
        <button
          className="text-sm font-medium text-[#181111] cursor-pointer"
          onClick={handleLogout}
        >
          Logout
        </button>
        <a
          className="text-sm font-medium text-[#181111] cursor-pointer"
          href="/face-scan"
        >
          Start a new scan
        </a>
        <a
          href="/profile"
          className="flex max-w-[84px] cursor-pointer items-center justify-center rounded-full h-10 px-4 bg-[#e61919] text-white text-sm font-bold hover:bg-red-500 transition"
        >
          <span className="truncate">{user?.user?.name[0]?.toUpperCase()}</span>
        </a>
      </div>

      {/* Mobile Dropdown Menu */}
      <div className="md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none">
            <Menu className="w-6 h-6 text-[#181111]" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="transition-all duration-200 ease-in-out transform data-[state=open]:scale-100 data-[state=closed]:scale-95 data-[state=open]:opacity-100 data-[state=closed]:opacity-0"
          >
            <DropdownMenuItem asChild>
              <a href="/face-scan">Start a new scan</a>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>
              Logout
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <a href="/profile" className="text-blue-600 font-semibold">
                Profile
              </a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
