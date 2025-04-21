"use client";

import { useUser } from "@/hooks/useUser";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react"; // Icon for dropdown trigger

export default function Header() {
  const { user, loading, error } = useUser();

  return (
    <header className="flex items-center justify-between border-b border-[#f4f0f0] px-4 md:px-10 py-3">
      {/* Logo */}
      <a href="/" className="flex items-center gap-2">
        <img
          src="logo.png"
          alt="StrokeShield Logo"
          className="h-10 object-contain"
        />
        <h2 className="text-[#181111] text-lg font-bold">StrokeShield</h2>
      </a>

      {/* Desktop Nav (hidden on mobile) */}
      <div className="hidden md:flex items-center gap-8">
        <a href="/how-it-works" className="text-sm font-medium text-[#181111]">
          How it Works
        </a>
        <a href="/faq" className="text-sm font-medium text-[#181111]">
          FAQ
        </a>

        {user ? (
          <a
            href="/profile"
            className="flex items-center justify-center rounded-full h-10 px-4 bg-[#e61919] text-white text-sm font-bold hover:bg-red-500 transition"
          >
            <span className="truncate">
              {user?.user?.name[0]?.toUpperCase()}
            </span>
          </a>
        ) : (
          <a
            href="/login"
            className="flex items-center justify-center rounded-full h-10 px-4 bg-[#e61919] text-white text-sm font-bold hover:bg-red-500 transition"
          >
            Get Started
          </a>
        )}
      </div>

      {/* Mobile Dropdown (hidden on md and up) */}
      <div className="md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger className="p-2">
            <Menu className="h-6 w-6 text-[#181111]" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="transition-all duration-200 ease-in-out transform data-[state=open]:scale-100 data-[state=closed]:scale-95 data-[state=open]:opacity-100 data-[state=closed]:opacity-0"
          >
            <DropdownMenuItem asChild>
              <a href="/how-it-works">How it Works</a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href="/faq">FAQ</a>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {user ? (
              <DropdownMenuItem asChild>
                <a href="/profile">Go to Profile</a>
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem asChild>
                <a href="/login">Get Started</a>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
