// API Route: /api/activities — Suivi d'activités terrain
// Fallback mémoire si Supabase non configuré
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { fallback } from "@/lib/supabase-fallback";

const uid = () => Math.random().toString(36).slice(2, 10);
interface MemActivity {
  id: string; type: string; titre: string; description: string;
  date: string; responsable: string; statut: string; created_at: string;
}
const activitiesMem: MemActivity[] = [
  { id: uid(), type: "collecte", titre: "Enquête ménage Zone A", description: "120 ménages enquêtés", date: "2026-04-15", responsable: "AGBOTON Michel", statut: "termine", created_at: new Date().toISOString() },
  { id: uid(), type: "formation", titre: "Formation ASC paludisme", description: "25 participants", date: "2026-05-10", responsable: "SAGBO A. Paul", statut: "termine", created_at: new Date().toISOString() },
  { id: uid(), type: "distribution", titre: "Distribution kits scolaires", description: "200 kits distribués", date: "2026-05-20", responsable: "CHABI Ganiou", statut: "termine", created_at: new Date().toISOString() },
  { id: uid(), type: "sante", titre: "Campagne vaccination Penta 3", description: "En cours", date: "2026-06-15", responsable: "DOSSOU Victoire", statut: "en_cours", created_at: new Date().toISOString() },
  { id: uid(), type: "formation", titre: "Atelier genre et inclusion", description: "Planifié", date: "2026-07-01", responsable: "KPATCHA A. Esther", statut: "planifie", created_at: new Date().toISOString() },
];

export async function GET() {
  if (!fallback.isConfigured()) {
    return NextResponse.json(activitiesMem);
  }

  const { data, error } = await supabase
    .from("activities")
    .select("*")
    .order("date", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!fallback.isConfigured()) {
      const a: MemActivity = {
        id: uid(), type: body.type || "", titre: body.titre || "",
        description: body.description || "", date: body.date || new Date().toISOString().slice(0, 10),
        responsable: body.responsable || "", statut: body.statut || "planifie",
        created_at: new Date().toISOString(),
      };
      activitiesMem.unshift(a);
      return NextResponse.json(a, { status: 201 });
    }

    const { data, error } = await supabase
      .from("activities")
      .insert({
        type: body.type || "", titre: body.titre || "", description: body.description || "",
        date: body.date || new Date().toISOString().split("T")[0],
        responsable: body.responsable || "", statut: body.statut || "planifie",
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id requis (?id=...)" }, { status: 400 });

  if (!fallback.isConfigured()) {
    const idx = activitiesMem.findIndex((a) => a.id === id);
    if (idx === -1) return NextResponse.json({ error: "Activité introuvable" }, { status: 404 });
    activitiesMem.splice(idx, 1);
    return NextResponse.json({ success: true, message: "Activité supprimée" });
  }

  const { error } = await supabase.from("activities").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, message: "Activité supprimée" });
}
