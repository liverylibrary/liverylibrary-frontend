"use client";

import { useEffect, useState } from "react";
import { getCurrentUser, logoutUser } from "@/lib/auth";
import { useRouter, usePathname } from "next/navigation";
import { Plane, Upload, Home, User, LogOut } from "lucide-react";
import Image from "next/image";
import logo from "@/app/images/logo.png";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const u = getCurrentUser();
    if (u) setUser(u);
  }, []);

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    router.push("/");
  };

  const navItems = [
    { label: "Home", icon: <Home size={16} />, href: "/" },
    { label: "Liveries", icon: <Plane size={16} />, href: "/liveries" },
    { label: "Upload", icon: <Upload size={16} />, href: "/upload" },
  ];

  return (
    <header className="backdrop-blur-xl bg-[#191308bb] border-b border-[#454b66]/30 sticky top-0 z-50 shadow-[0_1px_12px_rgba(103,125,183,0.15)]">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
        {/* Left - Logo */}
        <div
          onClick={() => router.push("/")}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <Image
            src={logo}
            alt="LiveryLibrary Logo"
            width={40}
            height={40}
            className="rounded-lg shadow-[0_0_10px_rgba(103,125,183,0.25)] group-hover:scale-105 transition-transform"
          />
          <h1 className="text-2xl font-bold text-[#9ca3db] tracking-wide group-hover:text-[#677db7] transition-colors">
            Livery<span className="text-[#677db7]">Library</span>
          </h1>
        </div>

        {/* Center - Nav Items */}
        <nav className="hidden md:flex space-x-6">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => router.push(item.href)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
                pathname === item.href
                  ? "bg-[#454b66]/60 text-[#9ca3db] shadow-inner"
                  : "text-gray-300 hover:text-[#9ca3db] hover:bg-[#454b66]/30"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Right - Auth / Profile */}
        <div className="relative">
          {!user ? (
            <div className="flex gap-3">
              <button
                onClick={() => router.push("/login")}
                className="px-3 py-1.5 bg-[#677db7] text-white rounded-lg hover:bg-[#9ca3db] transition"
              >
                Login
              </button>
              <button
                onClick={() => router.push("/register")}
                className="px-3 py-1.5 bg-[#454b66]/40 text-[#9ca3db] rounded-lg hover:bg-[#454b66]/60 transition"
              >
                Register
              </button>
            </div>
          ) : (
            <div className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 px-4 py-1.5 bg-[#454b66]/50 hover:bg-[#454b66]/70 rounded-lg text-[#9ca3db] transition"
              >
                <User size={16} /> {user.username}
              </button>

              {open && (
                <div
                  onMouseLeave={() => setOpen(false)}
                  className="absolute right-0 mt-2 bg-[#191308]/90 border border-[#454b66]/40 rounded-lg shadow-lg w-48 backdrop-blur-xl"
                >
                  <button
                    onClick={() => {
                      setOpen(false);
                      router.push("/profile");
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-[#454b66]/40 flex items-center gap-2 text-[#9ca3db]"
                  >
                    <User size={15} /> My Profile
                  </button>
                  <button
                    onClick={() => {
                      setOpen(false);
                      router.push("/upload");
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-[#454b66]/40 flex items-center gap-2 text-[#9ca3db]"
                  >
                    <Upload size={15} /> Upload Livery
                  </button>
                  <button
                    onClick={() => {
                      handleLogout();
                      setOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-red-600/20 flex items-center gap-2 text-red-400"
                  >
                    <LogOut size={15} /> Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
