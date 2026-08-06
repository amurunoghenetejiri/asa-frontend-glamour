import { useEffect, useState } from "react";
import { resolveMedia } from "@/lib/media";

export function useMediaUrl(ref: string | null | undefined) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    setUrl(null);
    resolveMedia(ref).then((u) => alive && setUrl(u));
    return () => {
      alive = false;
    };
  }, [ref]);
  return url;
}

export function SignedImg({ src, className, alt = "" }: { src: string | null | undefined; className?: string; alt?: string }) {
  const url = useMediaUrl(src);
  if (!url) return <div className={`animate-pulse bg-muted ${className ?? ""}`} />;
  return <img src={url} alt={alt} loading="lazy" className={className} />;
}

export function SignedVideo({ src, className }: { src: string | null | undefined; className?: string }) {
  const url = useMediaUrl(src);
  if (!url) return <div className={`animate-pulse bg-muted ${className ?? ""}`} />;
  return <video src={url} controls playsInline className={className} />;
}

export function Avatar({
  src,
  name,
  size = 40,
  className = "",
}: {
  src: string | null | undefined;
  name?: string | null;
  size?: number;
  className?: string;
}) {
  const url = useMediaUrl(src);
  const initials = (name || "?").trim().slice(0, 1).toUpperCase();
  if (url) {
    return <img src={url} alt={name ?? ""} style={{ width: size, height: size }} className={`shrink-0 rounded-full object-cover ${className}`} />;
  }
  return (
    <div
      style={{ width: size, height: size, fontSize: Math.max(11, size * 0.4) }}
      className={`grid shrink-0 place-items-center rounded-full bg-primary font-bold text-primary-foreground ${className}`}
    >
      {initials}
    </div>
  );
}
