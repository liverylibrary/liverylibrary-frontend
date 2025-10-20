"use client";
import { useState } from "react";
import { loginUser } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginUser(email, password);
      router.push("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-[#191308] text-[#9ca3db] px-4">
      <div className="bg-[rgba(50,42,38,0.6)] backdrop-blur-xl border border-[rgba(103,125,183,0.2)] rounded-2xl shadow-[0_0_30px_rgba(103,125,183,0.15)] p-8 w-full max-w-sm transition-all">
        <h1 className="text-3xl font-bold text-center mb-6 text-[#9ca3db]">Welcome Back</h1>
        {error && (
          <p className="text-red-400 bg-red-900/30 border border-red-700/40 rounded p-2 text-sm mb-4 text-center animate-pulse">
            {error}
          </p>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <Mail size={18} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="email"
              placeholder="Email"
              className="w-full pl-10 p-2 rounded bg-gray-800 border border-gray-700 focus:border-[#677db7] focus:ring-1 focus:ring-[#677db7] focus:outline-none transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <Lock size={18} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              className="w-full pl-10 p-2 rounded bg-gray-800 border border-gray-700 focus:border-[#677db7] focus:ring-1 focus:ring-[#677db7] focus:outline-none transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#677db7] hover:bg-[#9ca3db] text-[#191308] font-semibold p-2 rounded-lg shadow-[0_0_10px_rgba(103,125,183,0.4)] transition"
          >
            Login
          </button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-6">
          Don’t have an account?{" "}
          <button
            onClick={() => router.push("/register")}
            className="text-[#9ca3db] hover:text-[#b4c2f0] font-medium underline underline-offset-2 transition"
          >
            Register
          </button>
        </p>
      </div>
    </main>
  );
}
