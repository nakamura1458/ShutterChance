import { createClient } from "@/lib/supabase/server";

export async function getActivePlans() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("event_plans")
    .select(`
      id,
      name,
      price,
      max_upload_count,
      retention_days
    `)
    .eq("is_active", true)
    .order("price", { ascending: true });

  if (error) {
    console.error("プラン取得エラー:", error);
    throw new Error("プランの取得に失敗しました");
  }

  return data;
}