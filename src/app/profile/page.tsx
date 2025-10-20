"use client";

import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/auth";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { Upload, Image, User, Calendar } from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [liveries, setLiveries] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    const u = getCurrentUser();
    if (!u) router.push("/login");
    else {
      setUser(u);
      fetchMyProfile();
      fetchMyLiveries();
    }
  }, []);

  const fetchMyProfile = async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMyLiveries = async () => {
    try {
      const res = await api.get("/liveries/my");
      setLiveries(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // --- AUTO-UPLOAD HANDLERS ---
  const handleFileUpload = async (type: "avatar" | "banner", file: File) => {
    try {
      const form = new FormData();
      form.append(type, file);

      const endpoint =
        type === "avatar" ? "/users/profile/avatar" : "/users/profile/banner";

      const res = await api.post(endpoint, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUser((prev: any) => ({
        ...prev,
        [`${type}Url`]: res.data[`${type}Url`],
      }));

      setMessage(`✅ ${type === "avatar" ? "Avatar" : "Banner"} updated!`);
    } catch (err) {
      console.error(err);
      setMessage(`❌ Failed to update ${type}.`);
    }
  };


  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload("avatar", e.target.files[0]);
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload("banner", e.target.files[0]);
    }
  };

  if (!user)
    return (
      <p className="text-center text-gray-400 mt-40 animate-pulse">
        Loading your profile...
      </p>
    );

  const avatarPreview = user.avatarUrl
    ? `${apiBase}${user.avatarUrl}`
    : "https://placehold.co/150x150?text=Avatar";

  const bannerPreview = user.bannerUrl
    ? `${apiBase}${user.bannerUrl}`
    : "https://placehold.co/1600x400?text=Profile+Banner";

  return (
    <main className="min-h-screen bg-[#191308] text-[#9ca3db]">
      {/* Banner */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={bannerPreview}
          alt="Profile banner"
          className="w-full h-full object-cover opacity-80 transition-all duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#191308] via-[#191308]/70 to-transparent" />

        {/* Change banner button */}
        <label className="absolute top-5 right-5 bg-[rgba(103,125,183,0.2)] hover:bg-[rgba(103,125,183,0.4)] border border-[rgba(103,125,183,0.4)] text-[#9ca3db] px-4 py-2 rounded-lg cursor-pointer backdrop-blur-md flex items-center gap-2 text-sm transition">
          <Image size={16} /> Change Banner
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleBannerChange}
          />
        </label>

        {/* Avatar + change button */}
        <div className="absolute inset-y-0 left-10 flex items-center gap-5 z-20">
          <div className="relative group">
            <img
              src={avatarPreview}
              alt="User Avatar"
              className="w-32 h-32 rounded-full border-4 border-[#191308] object-cover shadow-[0_0_25px_rgba(103,125,183,0.6)] animate-[pulseGlow_3s_ease-in-out_infinite] group-hover:brightness-90 transition"
            />
            <div className="absolute inset-0 rounded-full blur-2xl bg-[#677db7]/30 animate-[pulseGlow_3s_ease-in-out_infinite]" />

            {/* Change Avatar button */}
            <label className="absolute bottom-0 right-0 bg-[rgba(103,125,183,0.3)] hover:bg-[rgba(103,125,183,0.5)] border border-[rgba(103,125,183,0.5)] text-[#191308] px-3 py-1 rounded-md cursor-pointer backdrop-blur-md text-xs font-semibold transition flex items-center gap-1 shadow-[0_0_10px_rgba(103,125,183,0.4)]">
              <User size={12} /> Change
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </label>
          </div>

          <div>
            <h1 className="text-3xl font-bold text-[#9ca3db]">
              {user.username}
            </h1>
            <p className="text-sm text-[#677db7] capitalize">
              {user.role || "member"}
            </p>
            <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
              <Calendar size={14} /> Joined{" "}
              {new Date(user.dateJoined).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <section className="max-w-6xl mx-auto px-6 pt-36">
        {message && (
          <p className="text-center mb-6 text-[#677db7] transition-all duration-500">
            {message}
          </p>
        )}

        {/* My Liveries */}
        <h2 className="text-2xl font-semibold mb-4 text-[#9ca3db]">
          My Liveries
        </h2>
        {liveries.length === 0 ? (
          <p className="text-gray-400 text-center">
            You haven’t uploaded any liveries yet.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveries.map((l) => (
              <div
                key={l._id}
                onClick={() => router.push(`/liveries/${l._id}`)}
                className="bg-[rgba(50,42,38,0.6)] border border-[rgba(103,125,183,0.25)] backdrop-blur-xl rounded-xl overflow-hidden hover:shadow-[0_0_20px_rgba(103,125,183,0.25)] transition cursor-pointer"
              >
                <img
                  src={
                    l.images?.[0]
                      ? `${apiBase}${l.images[0]}`
                      : "https://placehold.co/600x300?text=No+Preview"
                  }
                  alt={l.name}
                  className="w-full h-44 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-[#9ca3db]">{l.name}</h3>
                  <p className="text-sm text-gray-400">{l.aircraft}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
