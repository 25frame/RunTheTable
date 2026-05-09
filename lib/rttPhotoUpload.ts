type SupabaseUploadResult = {
  data?: { path?: string } | null;
  error?: { message?: string } | null;
};

type SupabasePublicUrlResult = {
  data?: { publicUrl?: string } | null;
};

type SupabaseLike = {
  storage: {
    from: (bucket: string) => {
      upload: (
        path: string,
        file: File,
        options?: { cacheControl?: string; upsert?: boolean }
      ) => Promise<SupabaseUploadResult>;
      getPublicUrl: (path: string) => SupabasePublicUrlResult;
    };
  };
};

function fileExtension(file: File) {
  const fromName = file.name.split(".").pop()?.toLowerCase();
  if (fromName && /^[a-z0-9]+$/.test(fromName)) return fromName;
  const fromType = file.type.split("/").pop()?.toLowerCase();
  return fromType || "jpg";
}

function safeId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export async function uploadRTTPhoto(file: File): Promise<string> {
  if (!file) return "";

  const mod = await import("@/lib/supabaseClient").catch(() => null);
  const supabase = (mod as { supabase?: SupabaseLike } | null)?.supabase;
  const bucket =
    (mod as { SUPABASE_PHOTO_BUCKET?: string } | null)?.SUPABASE_PHOTO_BUCKET ||
    process.env.NEXT_PUBLIC_SUPABASE_PHOTO_BUCKET ||
    "rtt-player-photos";

  if (!supabase) {
    throw new Error("Photo upload is not configured. Submit without a photo or add lib/supabaseClient.ts.");
  }

  const ext = fileExtension(file);
  const path = `joins/${Date.now()}-${safeId()}.${ext}`;
  const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) {
    throw new Error(error.message || "Photo upload failed.");
  }

  const uploadedPath = data?.path || path;
  const publicResult = supabase.storage.from(bucket).getPublicUrl(uploadedPath);
  const publicUrl = publicResult.data?.publicUrl;

  if (!publicUrl) {
    throw new Error("Photo uploaded but no public URL was returned.");
  }

  return publicUrl;
}
