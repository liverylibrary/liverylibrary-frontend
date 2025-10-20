"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Plane, Search, UploadCloud, Users } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [recent, setRecent] = useState<any[]>([]);
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    fetchRecent();
  }, []);

  const fetchRecent = async () => {
    try {
      const res = await api.get("/liveries/recent");
      setRecent(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="min-h-screen bg-[#191308] text-gray-100 overflow-hidden">
      {/* Animated background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,#677db7_0%,transparent_60%),radial-gradient(circle_at_80%_80%,#454b66_0%,transparent_70%)] opacity-30 animate-pulse" />

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center py-32 px-6 z-10">
        <h1 className="text-6xl md:text-7xl font-extrabold text-[#9ca3db] drop-shadow-[0_0_25px_rgba(103,125,183,0.3)] leading-tight">
          Explore. Create. <br />
          <span className="text-[#677db7]">Fly.</span>
        </h1>

        <p className="text-gray-400 mt-6 text-lg max-w-2xl">
          Discover a growing library of beatiful livery designs from the Limitless Airline Manager Community, or upload your own.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mt-10">
          <button
            onClick={() => router.push("/liveries")}
            className="bg-[#677db7] hover:bg-[#9ca3db] text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 shadow-[0_0_15px_rgba(103,125,183,0.5)] transition"
          >
            <Search size={18} /> Browse Liveries
          </button>
          <button
            onClick={() => router.push("/upload")}
            className="bg-[#322a26] border border-[#677db7]/40 hover:bg-[#454b66]/40 text-[#9ca3db] px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition"
          >
            <UploadCloud size={18} /> Upload Yours
          </button>
        </div>
      </section>

      {/* Divider line */}
      <div className="border-t border-[#454b66]/30 w-3/4 mx-auto my-10" />

      {/* Recent Liveries */}
      <section className="max-w-6xl mx-auto px-6 pb-20 relative z-10">
        <h2 className="text-3xl font-semibold mb-8 text-[#9ca3db] text-center">
          ✨ Recently Uploaded
        </h2>

        {recent.length === 0 ? (
          <p className="text-gray-500 text-center">No liveries yet... be the first to upload!</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {recent.map((livery) => (
              <div
                key={livery._id}
                onClick={() => router.push(`/liveries/${livery._id}`)}
                className="group bg-[rgba(50,42,38,0.6)] backdrop-blur-xl border border-[#454b66]/30 rounded-xl overflow-hidden shadow-[0_0_15px_rgba(103,125,183,0.1)] hover:shadow-[0_0_25px_rgba(103,125,183,0.3)] transform hover:-translate-y-1 transition cursor-pointer"
              >
                <img
                  src={
                    livery.images?.[0]
                      ? `${apiBase}${livery.images[0]}`
                      : "https://placehold.co/600x300?text=No+Preview"
                  }
                  alt={livery.name}
                  className="w-full h-48 object-cover group-hover:opacity-90 transition"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-[#9ca3db] truncate">
                    {livery.name}
                  </h3>
                  <p className="text-sm text-gray-400 truncate flex items-center gap-1">
                    <Plane size={14} /> {livery.aircraft || "Unknown Aircraft"}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    by{" "}
                    <span className="text-[#677db7] font-medium">
                      {livery.author?.username || "Unknown"}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Top Creators Section */}
      <section className="bg-[#322a26]/50 backdrop-blur-xl border-t border-[#454b66]/30 py-16 px-6 text-center">
        <h2 className="text-3xl font-semibold text-[#9ca3db] mb-8">
          🧑‍🎨 Meet Our Top Creators
        </h2>
        <div className="flex flex-wrap justify-center gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex flex-col items-center bg-[rgba(50,42,38,0.5)] border border-[#454b66]/30 p-4 rounded-xl w-44 shadow-[0_0_10px_rgba(103,125,183,0.2)] hover:shadow-[0_0_20px_rgba(103,125,183,0.3)] transition"
            >
              <img
                src={`https://placehold.co/100x100?text=User+${i}`}
                alt={`Creator ${i}`}
                className="w-20 h-20 rounded-full border-2 border-[#677db7] object-cover mb-3"
              />
              <p className="font-semibold text-[#9ca3db]">Creator{i}</p>
              <p className="text-sm text-gray-400">12 Liveries</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-24 px-6 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#454b66_0%,#191308_80%)] opacity-30"></div>
        <div className="relative z-10">
          <h2 className="text-4xl font-bold text-[#9ca3db] mb-4">
            Ready to Upload Your Masterpiece?
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Join us on your journey of livery creation within Limitless Airline Manager.
          </p>
          <button
            onClick={() => router.push("/upload")}
            className="bg-[#677db7] hover:bg-[#9ca3db] text-white px-8 py-3 rounded-lg font-semibold shadow-[0_0_20px_rgba(103,125,183,0.4)] transition"
          >
            Start Uploading →
          </button>
        </div>
      </section>
    </main>
  );
}
