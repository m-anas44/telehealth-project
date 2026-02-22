"use client";

import { getDoctorSuggestionFromAI } from "@/handlers/aiHandler";
import { ArrowRight, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const AISuggestionBanner = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getDoctorSuggestionFromAI();
        setData(res);
      } catch (err) {
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (!loading && !data) return null;
  return (
    <div
      className={`flex items-start gap-3 border p-3 rounded-xl transition-all duration-500 animate-in fade-in slide-in-from-top-2 ${data?.type === "INCOMPLETE_PROFILE" ? "bg-amber-50 border-amber-100" : "bg-cyan-50 border-cyan-100"}`}
    >
      <div className="bg-white p-2 rounded-lg shadow-sm">
        {loading ? (
          <Loader2 className="w-5 h-5 text-[#0891b2] animate-spin" />
        ) : (
          <Sparkles
            className={`w-5 h-5 ${data?.type === "INCOMPLETE_PROFILE" ? "text-amber-500" : "text-[#0891b2]"}`}
          />
        )}
      </div>
      <div className="flex-1">
        <p
          className={`text-[10px] font-bold uppercase tracking-widest mb-0.5 
          ${data?.type === "INCOMPLETE_PROFILE" ? "text-amber-900" : "text-cyan-900"}`}
        >
          {data?.type === "INCOMPLETE_PROFILE"
            ? "Action Required"
            : "AI Recommendation"}
        </p>
        {loading ? (
          <div className="h-4 w-3/4 bg-cyan-100 animate-pulse rounded" />
        ) : (
          <div className="max-w-75">
            <p
              className={`text-xs leading-tight ${data?.type === "INCOMPLETE_PROFILE" ? "text-amber-700" : "text-cyan-700"}`}
            >
              {data?.type === "INCOMPLETE_PROFILE"
                ? data.message
                : data.reasoning}
            </p>
            {data?.type === "INCOMPLETE_PROFILE" && (
              <Link
                href="/dashboard/profile"
                className="flex items-center text-xs font-bold text-amber-600 hover:text-amber-700 shrink-0 mt-1"
              >
                Update <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AISuggestionBanner;
