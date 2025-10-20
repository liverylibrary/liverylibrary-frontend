"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import {
  Heart,
  MessageSquare,
  Copy,
  ArrowLeft,
  Plane,
  WandSparkles,

} from "lucide-react";

export default function LiveryDetailPage() {
  const { id } = useParams();
  const [livery, setLivery] = useState<any>(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [more, setMore] = useState<any[]>([]);
  const router = useRouter();

  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    const u = getCurrentUser();
    if (u) setUser(u);
    fetchLivery();
  }, [id]);

  const fetchLivery = async () => {
    try {
      const res = await api.get(`/liveries/${id}`);
      setLivery(res.data);
      setLikeCount(res.data.likes?.length || 0);
      if (res.data.author?._id)
        fetchMore(res.data.author._id, res.data._id);
    } catch (err) {
      console.error("Error loading livery", err);
    } finally {
      setLoading(false);
    }
  };

  const [avatar, setAvatar] = useState("");


  const fetchUserAvatar = async (username: string) => {
    const res = await api.get(`/users/${username}`);
    return res.data.user.avatarUrl;
  };

  useEffect(() => {
    const loadAvatar = async () => {
      if (!livery?.author?.username) return;
      try {
        const res = await api.get(`/users/${livery.author.username}`);
        const url = res.data.user.avatarUrl;
        setAvatar(url ? `${apiBase}${url}` : "/default-avatar.png");
      } catch (err) {
        console.error("Error loading author avatar:", err);
        setAvatar("/default-avatar.png");
      }
    };
    loadAvatar();
  }, [livery]);


  const fetchMore = async (authorId: string, excludeId: string) => {
    try {
      const res = await api.get(`/liveries/author/${authorId}/${excludeId}`);
      setMore(res.data);
    } catch (err) {
      console.error("Error loading author’s other liveries", err);
    }
  };

  const handleLike = async () => {
    if (!user) return alert("You must be logged in to like this livery.");
    try {
      const res = await api.post(`/liveries/${id}/like`);
      setLiked(res.data.liked);
      setLikeCount(res.data.likes);
    } catch (err) {
      console.error(err);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return alert("You must be logged in to comment.");
    if (!comment.trim()) return;
    try {
      const res = await api.post(`/liveries/${id}/comments`, { text: comment });
      setLivery({ ...livery, comments: res.data });
      setComment("");
    } catch (err) {
      console.error("Error posting comment", err);
    }
  };

  if (loading)
    return (
      <div className="text-center text-gray-400 mt-32 animate-pulse">
        Loading livery...
      </div>
    );

  if (!livery)
    return <p className="text-center text-gray-400 mt-32">Not found.</p>;

  const mainImg =
    livery.images?.[0] ||
    "https://placehold.co/1200x600?text=Livery+Preview+Unavailable";

  return (
    <main className="min-h-screen bg-[#191308] text-[#9ca3db] relative">
      {/* Hero */}
      <section className="relative h-[60vh] overflow-hidden">
        <img
          src={`${apiBase}${mainImg}`}
          alt="Livery Hero"
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#191308] via-[#191308]/70 to-transparent"></div>

        {/* Hero overlay */}
        <div className="absolute bottom-10 left-0 right-0 text-center">
          <h1 className="text-5xl font-bold mb-3 drop-shadow-lg text-[#9ca3db]">
            {livery.name}
          </h1>
          <p className="text-[#677db7] text-lg font-medium flex items-center justify-center gap-2">
            <Plane size={18} /> {livery.aircraft}
          </p>
        </div>

        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="absolute top-6 left-6 bg-[#191308]/70 text-[#9ca3db] px-4 py-2 rounded-lg hover:bg-[#454b66]/40 transition"
        >
          <ArrowLeft size={16} className="inline-block mr-2" />
          Back
        </button>
      </section>

      {/* Info Section */}
      <section className="max-w-5xl mx-auto p-6 -mt-24 relative z-10">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Panel */}
          <div className="md:col-span-2 bg-[rgba(50,42,38,0.6)] backdrop-blur-xl border border-[rgba(103,125,183,0.25)] rounded-2xl p-6 shadow-[0_0_25px_rgba(103,125,183,0.08)]">
            <h2 className="text-xl font-semibold mb-2 text-[#9ca3db]">Description</h2>
            <p className="text-gray-400 mb-6">
              {livery.description || "No description provided."}
            </p>

            {/* Image Gallery */}
            {livery.images?.length > 1 && (
              <section className="mt-8">
                <h3 className="text-lg font-semibold mb-4 text-[#677db7]">
                  Image Gallery
                </h3>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {livery.images.map((img: string, i: number) => (
                    <div
                      key={i}
                      className="relative group overflow-hidden rounded-lg border border-[#454b66]/30 cursor-pointer"
                      onClick={() => window.open(`${apiBase}${img}`, "_blank")}
                    >
                      <img
                        src={`${apiBase}${img}`}
                        alt={`Livery image ${i + 1}`}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                        <span className="text-[#9ca3db] text-sm font-semibold">
                          View Full Image
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Decal ID Section */}
            {livery.decalIds?.length > 0 && (
              <section className="mt-10 bg-[rgba(50,42,38,0.6)] backdrop-blur-xl border border-[rgba(103,125,183,0.25)] rounded-2xl p-6 shadow-[0_0_20px_rgba(103,125,183,0.1)]">
                <h2 className="flex items-center gap-2 text-xl font-semibold text-[#9ca3db] mb-4">
                  <WandSparkles size={18} className="text-[#677db7]" />
                  In-Game Decal IDs
                </h2>

                <p className="text-gray-400 text-sm mb-4">
                  The following IDs can be used in Limitless Airline Manager, multiple ids means this is probably a livery pack.
                </p>

                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {livery.decalIds.map((id: string, i: number) => (
                    <button
                      key={i}
                      onClick={() => {
                        navigator.clipboard.writeText(id);
                        const el = document.getElementById(`copy-${i}`);
                        if (el) {
                          el.textContent = "Copied!";
                          setTimeout(() => (el.textContent = "Copy"), 1000);
                        }
                      }}
                      className="flex justify-between items-center bg-[#322a26]/70 hover:bg-[#454b66]/40 transition-colors border border-[#454b66]/30 px-4 py-2 rounded-lg text-[#9ca3db] text-sm group"
                    >
                      <span className="font-mono truncate">{id}</span>
                      <span
                        id={`copy-${i}`}
                        className="text-xs text-[#677db7] group-hover:text-[#9ca3db]"
                      >
                        Copy
                      </span>
                    </button>
                  ))}
                </div>
              </section>
            )}

          </div>


          {/* Right Panel */}
          <aside className="space-y-4">
            <div className="bg-[rgba(50,42,38,0.6)] backdrop-blur-xl border border-[rgba(103,125,183,0.25)] rounded-2xl p-5">
              <h3 className="text-lg font-semibold text-[#9ca3db] mb-3">Author</h3>
              <div className="flex items-center gap-3">
                <img
                  src={avatar || "/default-avatar.png"}
                  alt={livery.author?.username || "Author Avatar"}
                  className="w-12 h-12 rounded-full border-2 border-[#454b66] object-cover shadow-[0_0_10px_rgba(103,125,183,0.3)]"
                />
                <div>
                  <p className="font-semibold text-[#677db7]">
                    {livery.author?.username || "Unknown"}
                  </p>
                  <button
                    onClick={() => router.push(`/profile/${livery.author?.username}`)}
                    className="text-xs text-[#9ca3db] hover:text-[#677db7]"
                  >
                    View Profile →
                  </button>
                </div>
              </div>
            </div>


            {/* Likes */}
            <div className="bg-[rgba(50,42,38,0.6)] backdrop-blur-xl border border-[rgba(103,125,183,0.25)] rounded-2xl p-5">
              <h3 className="text-lg font-semibold mb-3 text-[#9ca3db]">Engagement</h3>
              <div className="flex justify-around">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg ${liked
                    ? "bg-[#677db7] text-white"
                    : "bg-[#454b66]/50 hover:bg-[#677db7]/60 text-[#9ca3db]"
                    } transition`}
                >
                  <Heart size={16} /> {likeCount}
                </button>
                <div className="flex items-center gap-2 bg-[#454b66]/30 px-4 py-2 rounded-lg">
                  <MessageSquare size={16} /> {livery.comments?.length || 0}
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Comments */}
        <section className="mt-10 bg-[rgba(50,42,38,0.6)] backdrop-blur-xl border border-[rgba(103,125,183,0.25)] rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4 text-[#9ca3db]">
            Comments
          </h2>

          <form onSubmit={handleComment} className="flex gap-3 mb-6">
            <input
              type="text"
              placeholder="Write a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="flex-1 p-2 rounded bg-[#322a26]/70 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-[#677db7] hover:bg-[#9ca3db] px-4 py-2 rounded-lg text-white transition"
            >
              Post
            </button>
          </form>

          {livery.comments?.length ? (
            <div className="space-y-4">
              {livery.comments.map((c: any, i: number) => (
                <div
                  key={i}
                  className="bg-[#322a26]/50 border border-[#454b66]/30 p-3 rounded"
                >
                  <p className="text-sm text-gray-300">{c.text}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {c.username || "User"} •{" "}
                    {new Date(c.date).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No comments yet.</p>
          )}
        </section>

        {/* More From Author */}
        {more.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-semibold mb-4 text-[#9ca3db]">
              More from {livery.author?.username}
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {more.map((m) => (
                <div
                  key={m._id}
                  onClick={() => router.push(`/liveries/${m._id}`)}
                  className="bg-[rgba(50,42,38,0.6)] backdrop-blur-xl border border-[rgba(103,125,183,0.25)] rounded-xl overflow-hidden cursor-pointer hover:shadow-[0_0_20px_rgba(103,125,183,0.2)] transition"
                >
                  <img
                    src={
                      m.images?.[0]
                        ? `${apiBase}${m.images[0]}`
                        : "https://placehold.co/600x300?text=No+Preview"
                    }
                    alt={m.name}
                    className="w-full h-36 object-cover"
                  />
                  <div className="p-4">
                    <h4 className="text-lg font-semibold text-[#9ca3db] truncate">
                      {m.name}
                    </h4>
                    <p className="text-sm text-gray-400">{m.aircraft}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </section>
    </main>
  );
}
