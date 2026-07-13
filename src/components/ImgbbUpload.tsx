"use client";

import { useState } from "react";

const IMGBB_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY || "";

/**
 * Uploads a file to imgBB and returns the hosted URL.
 * Falls back to returning a data/object URL if no key is configured.
 */
export async function uploadToImgbb(file: File): Promise<string> {
  if (!IMGBB_KEY) {
    // No key configured — return a local object URL so the app still works.
    return URL.createObjectURL(file);
  }
  const form = new FormData();
  form.append("image", file);
  const res = await fetch(
    `https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`,
    { method: "POST", body: form }
  );
  const data = await res.json();
  if (!data?.success) {
    throw new Error(data?.error?.message || "Image upload failed");
  }
  return data.data.url as string;
}

export function useImageUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = async (file: File | undefined): Promise<string | null> => {
    if (!file) return null;
    setUploading(true);
    setError(null);
    try {
      return await uploadToImgbb(file);
    } catch (e) {
      setError((e as Error).message);
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { upload, uploading, error };
}