// API Route: /api/notifications — Push Subscription management
// Simple in-memory storage (pour prototype)
import { NextResponse } from "next/server";

const subscriptions: Array<{ endpoint: string; keys: Record<string, string>; user: string }> = [];

export async function POST(request: Request) {
  try {
    const { endpoint, keys, user } = await request.json();
    if (!endpoint) {
      return NextResponse.json({ error: "endpoint requis" }, { status: 400 });
    }

    // Éviter les doublons
    const exists = subscriptions.findIndex((s) => s.endpoint === endpoint);
    if (exists >= 0) {
      subscriptions[exists] = { endpoint, keys: keys || {}, user: user || "anonyme" };
    } else {
      subscriptions.push({ endpoint, keys: keys || {}, user: user || "anonyme" });
    }

    console.log(`📢 Notification push enregistrée pour ${user || "anonyme"} (${subscriptions.length} total)`);

    return NextResponse.json({
      success: true,
      message: "Abonnement push enregistré",
      total: subscriptions.length,
    });
  } catch {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json({
    total: subscriptions.length,
    users: subscriptions.map((s) => s.user),
  });
}

// Route pour envoyer une notification test
export async function PUT(request: Request) {
  try {
    const { titre, message, icone } = await request.json();
    const notifications = subscriptions.map((sub) => ({
      title: titre || "MEAL-Pro",
      body: message || "Nouvelle notification",
      icon: icone || "/icons/icon-192.png",
      endpoint: sub.endpoint,
    }));

    return NextResponse.json({
      success: true,
      envoyees: notifications.length,
      notifications,
    });
  } catch {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }
}
