"use client";

import { useEffect, useState } from "react";

/** Page active basée sur l'URL */
function getActiveTab(path: string): string {
  if (path.startsWith("/dashboard")) return "dash";
  return "dash";
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isClair, setIsClair] = useState(false);
  const [isSobre, setIsSobre] = useState(false);
  const [activeTab, setActiveTab] = useState("dash");
  const [ecoOpen, setEcoOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Restaurer préférences
    const savedTheme = localStorage.getItem("meal-theme");
    const savedSobre = localStorage.getItem("meal-sobre");
    if (savedTheme === "clair") setIsClair(true);
    if (savedSobre === "true") setIsSobre(true);
    setActiveTab(getActiveTab(window.location.pathname));
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.toggle("clair", isClair);
    document.documentElement.classList.toggle("sobre", isSobre);
    localStorage.setItem("meal-theme", isClair ? "clair" : "dark");
    localStorage.setItem("meal-sobre", String(isSobre));
  }, [isClair, isSobre, mounted]);

  const navigateTo = (tab: string) => {
    setActiveTab(tab);
    if (tab === "dash") {
      if (window.location.pathname !== "/dashboard") {
        window.location.href = "/dashboard";
      }
    }
  };

  const ecoData = {
    dataMo: isSobre ? "0,31 Mo" : "0,82 Mo",
    co2: isSobre ? "~0,5 g" : "~1,4 g",
    offline: "92%",
    barWidth: isSobre ? "46%" : "78%",
  };

  const navItems = [
    { id: "dash", icon: "📊", label: "Bord" },
    { id: "act", icon: "✓", label: "Activités" },
    { id: "collect", icon: "+", label: "Collecte", isAdd: true },
    { id: "map", icon: "🗺", label: "Carte" },
    { id: "profile", icon: "👤", label: "Profil" },
  ];

  // Rendu squelette pour le SSR (évite flash du mauvais thème)
  if (!mounted) {
    return (
      <div className="app-container">
        <div className="scroll-area">{children}</div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Barre d'état */}
      <div className="status-bar">
        <time>08:13</time>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {isSobre && (
            <span style={{
              fontSize: 9, fontWeight: 700, color: "var(--feuille)",
              background: "rgba(111,168,107,0.14)", borderRadius: 20, padding: "2px 7px",
            }}>
              🌿 Sobriété
            </span>
          )}
          <span>📶</span>
          <span>🔋 64%</span>
        </div>
      </div>

      {/* En-tête */}
      <header className="app-header">
        <div className="brand-row">
          <div className="brand">
            <div className="logo" aria-hidden="true" />
            <div>
              <h1>MEAL</h1>
              <small>Monitoring &amp; Evaluation</small>
            </div>
          </div>
          <div className="header-btns">
            <button
              className="icon-btn"
              onClick={() => setIsClair(!isClair)}
              title={isClair ? "Mode sombre" : "Mode clair"}
              aria-label="Basculer le thème"
            >
              {isClair ? "🌙" : "☀️"}
            </button>
            <button
              className="icon-btn"
              onClick={() => setIsSobre(!isSobre)}
              title={isSobre ? "Désactiver sobriété" : "Activer sobriété"}
              aria-label="Mode sobriété"
              style={isSobre ? { background: "rgba(111,168,107,0.18)", borderColor: "var(--feuille)" } : {}}
            >
              🌿
            </button>
          </div>
        </div>

        {/* Bandeau éco — SIGNATURE */}
        <div
          className="eco-banner"
          role="button"
          tabIndex={0}
          onClick={() => setEcoOpen(!ecoOpen)}
          onKeyDown={(e) => e.key === "Enter" && setEcoOpen(!ecoOpen)}
        >
          <div className="eco-icon">🌍</div>
          <div className="eco-body">
            <div className="eco-label">Empreinte de l&apos;app · ce mois</div>
            <div className="eco-value">
              <em>{ecoData.dataMo}</em> synchronisés · <em>{ecoData.co2}</em> CO₂e · hors-ligne <em>{ecoData.offline}</em>
            </div>
            <div className="eco-gauge">
              <span className="eco-gauge-inner" style={{ width: ecoData.barWidth }} />
            </div>
          </div>
          <span style={{ color: "var(--muet-2)", fontSize: 12 }}>›</span>
        </div>
      </header>

      {/* Zone de contenu scrollable */}
      <div className="scroll-area">
        {children}

        {/* Détail empreinte éco */}
        {ecoOpen && (
          <div className="card" style={{ marginTop: 4 }}>
            <h3>🌿 Détail empreinte</h3>
            <div style={{ fontSize: 11, color: "var(--muet)", marginTop: 8, lineHeight: 1.6 }}>
              <p>📦 <b style={{ color: "var(--ivoire)" }}>Poids app</b> : ~55 Ko (JS + CSS natifs)</p>
              <p>🌐 <b style={{ color: "var(--ivoire)" }}>Réseau</b> : sync différée, lots compressés</p>
              <p>🔋 <b style={{ color: "var(--ivoire)" }}>Énergie</b> : fond sombre OLED, animations coupables</p>
              <p>🤖 <b style={{ color: "var(--ivoire)" }}>IA</b> : réponses mises en cache, pas d&apos;appel inutile</p>
              <p style={{ marginTop: 6 }}>
                Le mode <b style={{ color: "var(--feuille)" }}>🌿 Sobriété</b> réduit l&apos;empreinte visiblement.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation basse */}
      <nav className="bottom-nav" role="tablist" aria-label="Navigation principale">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => navigateTo(item.id)}
            className={item.isAdd ? "nav-add" : ""}
            aria-current={activeTab === item.id ? "page" : undefined}
            aria-label={item.isAdd ? "Nouvelle collecte" : item.label}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
