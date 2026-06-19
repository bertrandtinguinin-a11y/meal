import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

/** GET /api/activities */
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("activities")
      .select("*")
      .order("prevu", { ascending: false });

    if (error) throw error;
    return NextResponse.json({ activities: data || [] });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Erreur";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
