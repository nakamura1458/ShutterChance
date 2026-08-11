import { createClient } from "@/lib/supabase/server";

export async function getEventByToken(eventToken: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("event_token", eventToken)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function getMyEvents() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data;
}

export async function getMyEventByToken(
  eventToken: string,
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("event_token", eventToken)
    .eq("user_id", user.id)
    .single();

  if (error) {
    return null;
  }

  return data;
}