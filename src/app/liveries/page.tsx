"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { Search, Plane, Filter } from "lucide-react";

export default function LiveriesPage() {
  const [liveries, setLiveries] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState({ aircraft: "", tag: "" });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    fetchLiveries();
  }, []);

  const fetchLiveries = async (customTag?: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (filter.aircraft) params.append("aircraft", filter.aircraft);
      if (customTag) {
        params.append("tag", customTag);
        setFilter((prev) => ({ ...prev, tag: customTag }));
      } else if (filter.tag) {
        params.append("tag", filter.tag);
      }

      const res = await api.get(`/liveries?${params.toString()}`);
      setLiveries(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    fetchLiveries();
  };

  const handleTagClick = (tag: string) => {
    fetchLiveries(tag);
  };

  return (
    <main className="min-h-screen bg-[#191308] text-[#9ca3db] px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-[#9ca3db] flex items-center gap-3">
          <Plane className="text-[#677db7]" /> Liveries
        </h1>

        {/* Search & Filters */}
        <form
          onSubmit={handleSearch}
          className="flex flex-wrap gap-4 bg-[rgba(50,42,38,0.6)] backdrop-blur-xl p-5 rounded-2xl border border-[rgba(103,125,183,0.25)] shadow-[0_0_20px_rgba(103,125,183,0.1)]"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Search liveries..."
              className="w-full pl-9 p-2 rounded-lg bg-[#322a26]/70 border border-[#454b66]/30 focus:outline-none focus:ring-1 focus:ring-[#677db7]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-3 flex-wrap">
            <input
              type="text"
              placeholder="Aircraft (e.g. A320)"
              className="p-2 rounded-lg bg-[#322a26]/70 border border-[#454b66]/30 focus:outline-none"
              value={filter.aircraft}
              onChange={(e) => setFilter({ ...filter, aircraft: e.target.value })}
            />
            <input
              type="text"
              placeholder="Tag (e.g. Retro)"
              className="p-2 rounded-lg bg-[#322a26]/70 border border-[#454b66]/30 focus:outline-none"
              value={filter.tag}
              onChange={(e) => setFilter({ ...filter, tag: e.target.value })}
            />
            <button
              type="submit"
              className="flex items-center gap-1 px-4 py-2 rounded-lg bg-[#677db7] text-white hover:bg-[#9ca3db] transition"
            >
              <Filter size={16} /> Apply
            </button>
          </div>
        </form>

        {/* Results */}
        <section className="mt-10">
          {loading ? (
            <p className="text-center text-gray-400">Loading...</p>
          ) : liveries.length === 0 ? (
            <p className="text-center text-gray-400">No liveries found.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {liveries.map((livery) => (
                <div
                  key={livery._id}
                  onClick={() => router.push(`/liveries/${livery._id}`)}
                  className="group relative bg-[rgba(50,42,38,0.6)] backdrop-blur-xl border border-[rgba(103,125,183,0.25)] rounded-2xl overflow-hidden shadow-[0_0_20px_rgba(103,125,183,0.08)] hover:shadow-[0_0_25px_rgba(103,125,183,0.2)] transition-transform hover:-translate-y-1 cursor-pointer"
                >
                  <img
                    src={
                      livery.images?.[0]
                        ? `${apiBase}${livery.images[0]}`
                        : "https://placehold.co/600x300?text=No+Preview"
                    }
                    alt={livery.name}
                    className="w-full h-48 object-cover opacity-90 group-hover:opacity-100 transition"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-[#9ca3db] truncate mb-1">
                      {livery.name}
                    </h3>
                    <p className="text-sm text-gray-400 mb-3">
                      {livery.aircraft || "Unknown Aircraft"}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {livery.tags?.map((tag: string, i: number) => (
                        <button
                          key={i}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTagClick(tag);
                          }}
                          className="text-xs bg-[#454b66]/40 hover:bg-[#677db7] text-[#9ca3db] px-2 py-1 rounded-full transition"
                        >
                          #{tag}
                        </button>
                      ))}
                    </div>
                    <div className="flex justify-between text-sm text-gray-400 mt-2">
                      <span>⭐ {livery.likes?.length || 0}</span>
                      <span>💬 {livery.comments?.length || 0}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
