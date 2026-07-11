import { useEffect, useState } from "react";

export function Splash({ onDone }: { onDone: () => void }) {
  const [leaving, setLeaving] = useState(false);
  useEffect(() => {
    const t1 = setTimeout(() => setLeaving(true), 6200);
    const t2 = setTimeout(() => onDone(), 6900);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  return (
    <div
      className={`fixed inset-0 z-[999] flex flex-col items-center justify-between py-16 transition-opacity duration-700 ${leaving ? "opacity-0" : "opacity-100"}`}
      style={{ background: "linear-gradient(160deg, #0B4A38 0%, #0F5A43 45%, #0A3E2E 100%)" }}
    >
      <div />
      <div className="flex flex-col items-center gap-6 px-6 text-center">
        <svg
          viewBox="0 0 500 200"
          className="w-[70vw] max-w-[520px]"
          style={{ animation: "gold-glow 2.4s ease-in-out 4.6s 2" }}
        >
          <defs>
            <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#B8860B" />
              <stop offset="35%" stopColor="#F5D77A" />
              <stop offset="55%" stopColor="#FFF3C4" />
              <stop offset="75%" stopColor="#E5B84B" />
              <stop offset="100%" stopColor="#8B6914" />
            </linearGradient>
          </defs>
          <text
            x="50%" y="55%"
            textAnchor="middle" dominantBaseline="middle"
            fontFamily="Syne, serif" fontWeight="700" fontSize="180"
            fill="url(#goldGrad)"
            stroke="url(#goldGrad)"
            strokeWidth="1.5"
            style={{
              strokeDasharray: 1400,
              strokeDashoffset: 1400,
              animation: "draw-asa 3s ease-in-out forwards, draw-asa 3s ease-in-out 3s forwards, fill-asa 2.4s ease-out 4.2s forwards",
              fillOpacity: 0,
            } as React.CSSProperties}
          >
            Asá
          </text>
        </svg>
        <p
          className="text-sm tracking-[0.35em] uppercase"
          style={{ color: "#F5D77A", opacity: 0, animation: "fade-up 0.9s ease-out 4.8s forwards" }}
        >
          Trusted. Verified. Nearby.
        </p>
      </div>
      <p
        className="text-xs tracking-[0.3em] uppercase"
        style={{ color: "#BDE0FE", opacity: 0, animation: "fade-up 0.9s ease-out 5.4s forwards" }}
      >
        Powered by <span className="font-semibold">HEPTALABS</span>
      </p>
    </div>
  );
}
