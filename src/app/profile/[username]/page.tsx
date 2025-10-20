"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import { Plane, Calendar, Upload, Heart, Edit3 } from "lucide-react";

export default function PublicProfilePage() {
  const { username } = useParams() as { username: string };
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [liveries, setLiveries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const current = getCurrentUser();
        if (current?.username === username) setIsOwner(true);

        const res = await api.get(`/users/${username}`);
        setUser(res.data.user);
        setLiveries(res.data.liveries);
      } catch (err) {
        console.error("Error loading profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [username]);

  if (loading)
    return (
      <div className="text-center text-gray-400 mt-40 animate-pulse">
        Loading {username}’s profile...
      </div>
    );

  if (!user)
    return (
      <p className="text-center text-red-400 mt-40">Profile not found.</p>
    );

  const banner =
    user.bannerUrl && user.bannerUrl !== ""
      ? `${apiBase}${user.bannerUrl}`
      : "https://placehold.co/1600x400?text=No+Banner";

  const avatar =
    user.avatarUrl && user.avatarUrl !== ""
      ? `${apiBase}${user.avatarUrl}`
      : "https://placehold.co/150x150?text=Avatar";

  return (
    <main className="min-h-screen bg-[#191308] text-[#9ca3db] relative">
      {/* Banner */}
      <section className="relative h-64 overflow-hidden">
        <img
          src={banner}
          alt="Profile Banner"
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#191308] via-[#191308]/70 to-transparent" />

        {/* Edit Button (only if your own profile) */}
        {isOwner && (
          <button
            onClick={() => router.push("/profile")}
            className="absolute top-6 right-6 bg-[rgba(103,125,183,0.2)] hover:bg-[rgba(103,125,183,0.4)] border border-[rgba(103,125,183,0.4)] backdrop-blur-md text-[#9ca3db] flex items-center gap-2 px-4 py-2 rounded-lg shadow-[0_0_15px_rgba(103,125,183,0.2)] transition"
          >
            <Edit3 size={16} /> Edit Profile
          </button>
        )}

        {/* Avatar */}
        <div className="absolute inset-y-0 left-10 flex items-center gap-5 z-20">
          <div className="relative">
            <img
              src={avatar}
              alt="User Avatar"
              className="w-32 h-32 rounded-full border-4 border-[#191308] object-cover shadow-[0_0_25px_rgba(103,125,183,0.6)] animate-[pulseGlow_3s_ease-in-out_infinite]"
            />
            {/* subtle glowing ring behind */}
            <div className="absolute inset-0 rounded-full blur-2xl bg-[#677db7]/30 animate-[pulseGlow_3s_ease-in-out_infinite]" />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-[#9ca3db]">{user.username}</h1>
            <p className="text-sm text-[#677db7] capitalize">
              {user.role || "member"}
            </p>
            <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
              <Calendar size={14} /> Joined{" "}
              {new Date(user.dateJoined).toLocaleDateString()}
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pt-36">
        {/* Stats */}
        <div className="bg-[rgba(50,42,38,0.6)] backdrop-blur-xl border border-[rgba(103,125,183,0.25)] rounded-2xl p-6 mb-10 shadow-[0_0_25px_rgba(103,125,183,0.15)]">

          <div className="flex justify-center md:justify-evenly mt-6 flex-wrap gap-10 text-center">
            <div>
              <Upload size={18} className="mx-auto text-[#677db7]" />
              <p className="font-semibold">{liveries.length}</p>
              <p className="text-xs text-gray-400">Uploads</p>
            </div>
            <div>
              <Heart size={18} className="mx-auto text-[#677db7]" />
              <p className="font-semibold">
                {liveries.reduce(
                  (sum, l) => sum + (l.likes?.length || 0),
                  0
                )}
              </p>
              <p className="text-xs text-gray-400">Total Likes</p>
            </div>
          </div>
        </div>

        {/* Liveries Showcase */}
        <h2 className="text-2xl font-semibold mb-6 text-[#9ca3db] text-center">
          {user.username}’s Liveries
        </h2>

        {liveries.length === 0 ? (
          <p className="text-center text-gray-500">
            No liveries uploaded yet.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveries.map((livery) => (
              <div
                key={livery._id}
                onClick={() => router.push(`/liveries/${livery._id}`)}
                className="group bg-[rgba(50,42,38,0.6)] border border-[rgba(103,125,183,0.25)] backdrop-blur-xl rounded-xl overflow-hidden shadow-[0_0_20px_rgba(103,125,183,0.1)] hover:shadow-[0_0_25px_rgba(103,125,183,0.3)] transition cursor-pointer"
              >
                <img
                  src={
                    livery.images?.[0]
                      ? `${apiBase}${livery.images[0]}`
                      : "https://placehold.co/600x300?text=No+Preview"
                  }
                  alt={livery.name}
                  className="w-full h-44 object-cover group-hover:opacity-90 transition"
                />
                <div className="p-4">
                  <h4 className="font-semibold text-[#9ca3db] text-lg truncate mb-1">
                    {livery.name}
                  </h4>
                  <p className="text-sm text-gray-400 mb-2 flex items-center gap-1">
                    <Plane size={14} /> {livery.aircraft || "Unknown"}
                  </p>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>⭐ {livery.likes?.length || 0}</span>
                    <span>
                      {new Date(livery.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
