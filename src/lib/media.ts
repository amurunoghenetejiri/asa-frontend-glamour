import { supabase } from "@/integrations/supabase/client";

export type MediaBucket = "avatars" | "portfolio" | "posts" | "documents" | "government-ids";

export const MAX_IMAGE_BYTES = 8 * 1024 * 1024; // 8MB
export const MAX_VIDEO_BYTES = 60 * 1024 * 1024; // 60MB
export const MAX_DOC_BYTES = 15 * 1024 * 1024; // 15MB

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
const VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
const DOC_TYPES = [...IMAGE_TYPES, "application/pdf"];

export function validateFile(file: File, kind: "image" | "video" | "doc"): string | null {
  if (kind === "image") {
    if (!IMAGE_TYPES.includes(file.type)) return "Only JPG, PNG, WEBP, GIF or AVIF images are allowed.";
    if (file.size > MAX_IMAGE_BYTES) return "Image must be smaller than 8MB.";
  } else if (kind === "video") {
    if (!VIDEO_TYPES.includes(file.type)) return "Only MP4, WEBM or MOV videos are allowed.";
    if (file.size > MAX_VIDEO_BYTES) return "Video must be smaller than 60MB.";
  } else {
    if (!DOC_TYPES.includes(file.type)) return "Only images or PDF documents are allowed.";
    if (file.size > MAX_DOC_BYTES) return "File must be smaller than 15MB.";
  }
  return null;
}

function slugName(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9.]+/g, "-").slice(-60);
}

/** Uploads a file and returns a portable reference string: "bucket/path". */
export async function uploadMedia(bucket: MediaBucket, userId: string, file: File): Promise<string> {
  const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${slugName(file.name)}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: false, contentType: file.type });
  if (error) throw error;
  return `${bucket}/${path}`;
}

export async function deleteMedia(ref: string) {
  const parsed = parseRef(ref);
  if (!parsed) return;
  await supabase.storage.from(parsed.bucket).remove([parsed.path]);
}

export function parseRef(ref: string | null | undefined): { bucket: MediaBucket; path: string } | null {
  if (!ref) return null;
  const idx = ref.indexOf("/");
  if (idx < 1) return null;
  return { bucket: ref.slice(0, idx) as MediaBucket, path: ref.slice(idx + 1) };
}

const cache = new Map<string, { url: string; exp: number }>();

/** Resolves a stored reference (or plain http URL) to a displayable URL. */
export async function resolveMedia(ref: string | null | undefined): Promise<string | null> {
  if (!ref) return null;
  if (/^https?:\/\//.test(ref) || ref.startsWith("data:") || ref.startsWith("blob:")) return ref;
  const hit = cache.get(ref);
  if (hit && hit.exp > Date.now()) return hit.url;
  const parsed = parseRef(ref);
  if (!parsed) return null;
  const { data, error } = await supabase.storage.from(parsed.bucket).createSignedUrl(parsed.path, 3600);
  if (error || !data?.signedUrl) return null;
  cache.set(ref, { url: data.signedUrl, exp: Date.now() + 50 * 60 * 1000 });
  return data.signedUrl;
}
