import { supabase } from "../lib/supabase";

export default async function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <h1 className="text-4xl font-bold">
        📸 ShutterChance
      </h1>
    </main>
  );
}