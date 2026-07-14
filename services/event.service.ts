import { supabase } from "@/lib/supabase/server";

export async function getEventByToken(eventToken: string) {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("event_token", eventToken)
    .single();

  console.log({
    data,
    error,
  });

  if (error) {
    return null;
  }

  return data;
}