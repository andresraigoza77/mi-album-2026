import type { User } from "@supabase/supabase-js";

import {
  ALBUM_STORAGE_VERSION,
  validateAlbumImport,
} from "@/lib/albumStorage";
import { supabase } from "@/lib/supabaseClient";
import type { AlbumState } from "@/lib/types";

const ALBUM_PROGRESS_TABLE = "album_progress";

export type CloudAlbumSnapshot = {
  state: AlbumState;
  updatedAt: string;
};

export async function getCurrentUser(): Promise<User | null> {
  const { data, error } = await supabase.auth.getSession();

  if (error) throw error;
  return data.session?.user ?? null;
}

export async function signInWithGoogle(): Promise<void> {
  const redirectTo = typeof window === "undefined" ? undefined : window.location.origin;
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: redirectTo ? { redirectTo } : undefined,
  });

  if (error) throw error;
}

export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function loadCloudAlbumState(): Promise<CloudAlbumSnapshot | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from(ALBUM_PROGRESS_TABLE)
    .select("album_state, updated_at")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const directResult = validateAlbumImport(JSON.stringify(data.album_state));
  const updatedAt =
    typeof data.updated_at === "string" ? data.updated_at : new Date(0).toISOString();

  if (directResult.success) {
    return { state: directResult.state, updatedAt };
  }

  const wrappedResult = validateAlbumImport(
    JSON.stringify({
      version: ALBUM_STORAGE_VERSION,
      state: data.album_state,
    }),
  );

  if (!wrappedResult.success) {
    throw new Error("El progreso guardado en la nube tiene una estructura inválida.");
  }

  return { state: wrappedResult.state, updatedAt };
}

export async function saveCloudAlbumState(
  albumState: AlbumState,
): Promise<CloudAlbumSnapshot | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  const updatedAt = new Date().toISOString();

  const { data, error } = await supabase
    .from(ALBUM_PROGRESS_TABLE)
    .upsert(
      {
        user_id: user.id,
        album_state: albumState,
        updated_at: updatedAt,
      },
      { onConflict: "user_id" },
    )
    .select("updated_at")
    .single();

  if (error) throw error;
  return {
    state: albumState,
    updatedAt: typeof data.updated_at === "string" ? data.updated_at : updatedAt,
  };
}
