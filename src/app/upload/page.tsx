"use client";

import { useState, useEffect } from "react";
import { getCurrentUser } from "@/lib/auth";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { UploadCloud, ChevronRight, ChevronLeft, Image, Plane, CheckCircle } from "lucide-react";

export default function UploadPage() {
  const router = useRouter();
  const [stage, setStage] = useState(1);
  const [user, setUser] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [primaryIndex, setPrimaryIndex] = useState(0);

  const [formData, setFormData] = useState({
    name: "",
    aircraft: "",
    description: "",
    tags: "",
    decalIds: "",
    images: [] as File[],
  });

  useEffect(() => {
    const u = getCurrentUser();
    if (!u) router.push("/login");
    else setUser(u);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, images: Array.from(e.target.files) });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("aircraft", formData.aircraft);
    data.append("description", formData.description);
    data.append("tags", JSON.stringify(formData.tags.split(",").map((t) => t.trim())));
    data.append("decalIds", JSON.stringify(formData.decalIds.split(",").map((t) => t.trim())));

    const reordered = [
      formData.images[primaryIndex],
      ...formData.images.filter((_, i) => i !== primaryIndex),
    ];
    reordered.forEach((file) => data.append("images", file));

    try {
      const res = await api.post("/liveries", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("✅ Upload successful!");
      console.log(res.data);
      setStage(1);
      setFormData({
        name: "",
        aircraft: "",
        description: "",
        tags: "",
        decalIds: "",
        images: [],
      });
    } catch (err: any) {
      console.error(err);
      setMessage(err.response?.data?.message || "Upload failed.");
    }
  };

  if (!user)
    return <p className="text-center text-gray-400 mt-20 animate-pulse">Loading...</p>;

  return (
    <div className="min-h-screen bg-[#191308] text-[#9ca3db] py-10 px-6">
      <div className="max-w-5xl mx-auto bg-[rgba(50,42,38,0.6)] border border-[rgba(103,125,183,0.2)] backdrop-blur-xl p-8 rounded-2xl shadow-[0_0_25px_rgba(103,125,183,0.15)] transition-all">
        <h1 className="text-3xl font-bold mb-6 text-center text-[#9ca3db] tracking-wide">
          ✈️ Upload New Livery
        </h1>

        {message && <p className="mb-4 text-center text-[#677db7]">{message}</p>}

        {/* Stage Progress */}
        <div className="flex justify-between items-center mb-10">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className={`flex-1 text-center py-2 rounded-lg mx-1 font-medium transition-all ${
                stage === n
                  ? "bg-[#677db7] text-[#191308] shadow-[0_0_15px_rgba(103,125,183,0.4)]"
                  : "bg-gray-800 text-gray-500"
              }`}
            >
              Stage {n}
            </div>
          ))}
        </div>

        {/* Stage 1 – Image Upload */}
        {stage === 1 && (
          <div className="animate-fadeIn">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Image size={18} /> Stage 1: Upload Images
            </h2>
            <div className="mb-6">
              <label
                htmlFor="file-upload"
                className="inline-flex items-center gap-2 bg-[#677db7]/20 border border-[#677db7]/50 
                          hover:bg-[#677db7]/30 text-[#9ca3db] px-5 py-2.5 rounded-lg cursor-pointer 
                          font-medium backdrop-blur-md shadow-[0_0_10px_rgba(103,125,183,0.3)] 
                          hover:shadow-[0_0_20px_rgba(103,125,183,0.4)] transition-all"
              >
                <UploadCloud size={18} />
                Choose Images
              </label>
              <input
                id="file-upload"
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>


            {formData.images.length > 0 ? (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {formData.images.map((img, index) => {
                  const url = URL.createObjectURL(img);
                  return (
                    <div
                      key={index}
                      className={`relative border-2 rounded-lg overflow-hidden cursor-pointer transition-all ${
                        primaryIndex === index
                          ? "border-[#677db7] shadow-[0_0_15px_rgba(103,125,183,0.3)]"
                          : "border-gray-700 hover:border-[#677db7]/70"
                      }`}
                      onClick={() => setPrimaryIndex(index)}
                    >
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover"
                      />
                      {primaryIndex === index && (
                        <span className="absolute bottom-1 left-1 bg-[#677db7] text-[#191308] text-xs px-2 py-1 rounded">
                          Primary
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-400 italic">No images selected yet.</p>
            )}

            <div className="flex justify-end mt-8">
              <button
                onClick={() => setStage(2)}
                disabled={formData.images.length === 0}
                className="bg-[#677db7] hover:bg-[#9ca3db] text-[#191308] font-semibold px-6 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50 transition-all"
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Stage 2 – Select Aircraft */}
        {stage === 2 && (
          <div className="animate-fadeIn">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Plane size={18} /> Stage 2: Select Aircraft
            </h2>
            <select
              name="aircraft"
              value={formData.aircraft}
              onChange={handleChange}
              className="w-full p-2 rounded-lg bg-gray-800 focus:outline-none mb-8 border border-gray-700"
            >
              <option value="">Select an aircraft...</option>
              <optgroup label="Commercial / Jet">
                <option>Airvan C220-300</option>
                <option>Airvan C320noa</option>
                <option>Airvan C330-900</option>
                <option>Datsalt Mercury</option>
                <option>Conveyor 090A Tornado</option>
                <option>YellowOlive MG-21</option>
              </optgroup>
              <optgroup label="Commercial / Heavy">
                <option>Bounce 848-8I</option>
                <option>Bounce 878-9 Aspirer</option>
                <option>Bounce 838 Min</option>
                <option>Airvan C340-300</option>
                <option>Airvan C350-900</option>
                <option>Airvan C380-800</option>
                <option>Lockmead Marvin M-4000</option>
              </optgroup>
              <optgroup label="Cargo / Heavy">
                <option>Airvan Ballerina XB</option>
                <option>Illusion In76</option>
                <option>McDonald Duchess D-17 Globetrotter</option>
                <option>Antonio AT225 Mariah</option>
              </optgroup>
              <optgroup label="Business / Small">
                <option>Tearjet TJ70</option>
                <option>Chessnah Situation Altitude</option>
                <option>Bankcraft Butler G85</option>
              </optgroup>
            </select>

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setStage(1)}
                className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-6 py-2 rounded-lg flex items-center gap-2 transition"
              >
                <ChevronLeft size={16} /> Back
              </button>
              <button
                onClick={() => formData.aircraft && setStage(3)}
                disabled={!formData.aircraft}
                className="bg-[#677db7] hover:bg-[#9ca3db] text-[#191308] px-6 py-2 rounded-lg flex items-center gap-2 font-semibold disabled:opacity-50 transition"
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Stage 3 – Details & Upload */}
        {stage === 3 && (
          <form onSubmit={handleSubmit} className="animate-fadeIn">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <UploadCloud size={18} /> Stage 3: Details & Submit
            </h2>

            <input
              name="name"
              placeholder="Livery Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 mb-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none"
              required
            />
            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 mb-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none h-24"
            />
            <input
              name="tags"
              placeholder="Tags (comma separated)"
              value={formData.tags}
              onChange={handleChange}
              className="w-full p-2 mb-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none"
            />
            <input
              name="decalIds"
              placeholder="Decal IDs (comma separated)"
              value={formData.decalIds}
              onChange={handleChange}
              className="w-full p-2 mb-6 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none"
            />

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setStage(2)}
                className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-6 py-2 rounded-lg flex items-center gap-2 transition"
              >
                <ChevronLeft size={16} /> Back
              </button>
              <button
                type="submit"
                className="bg-[#677db7] hover:bg-[#9ca3db] text-[#191308] font-semibold px-6 py-2 rounded-lg flex items-center gap-2 transition"
              >
                <CheckCircle size={16} /> Upload Livery
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
