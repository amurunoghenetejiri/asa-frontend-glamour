import { useEffect, useState } from "react";
import { resolveMedia } from "@/lib/media";

export function useMediaUrl(ref: string | null | undefined) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    setUrl(null);
    if (!ref) return;
    resolveMedia(ref).then((u) => {
      if (alive) setUrl(u);
    });
    return () => {
      alive = false;
    };
  }, [ref]);
  return url;
}

export function SignedImg({
  src,
  className,
  alt = "",
}: {
  src: string | null | undefined;
  className?: string;
  alt?: string;
}) {
  const url = useMediaUrl(src);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [url]);

  if (!src) return null;
  if (!url || failed) return <div className={`bg-muted ${className ?? ""}`} aria-hidden />;

  return (
    <img
      src={url}
      alt={alt}
      loading="lazy"
      className={className}
      onError={() => setFailed(true)}
    />
  );
}

export function SignedVideo({ src, className }: { src: string | null | undefined; className?: string }) {
  const url = useMediaUrl(src);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [url]);

  if (!src) return null;
  if (!url || failed) return <div className={`bg-muted ${className ?? ""}`} aria-hidden />;

  return <video src={url} controls playsInline className={className} onError={() => setFailed(true)} />;
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
  const [failed, setFailed] = useState(false);
  const initials = (name || "?").trim().slice(0, 1).toUpperCase();

  useEffect(() => {
    setFailed(false);
  }, [url]);

  if (url && !failed) {
    return (
      <img
        src={url}
        alt={name ?? ""}
        style={{ width: size, height: size }}
        className={`shrink-0 rounded-full object-cover ${className}`}
        onError={() => setFailed(true)}
      />
    );
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
