"use client";

import { useTheme } from "@/context/theme";
import { Settings, Bell, Globe, Database, Moon, Sun } from "lucide-react";

export default function ParametresPage() {
  const { isDark, toggle } = useTheme();

  const sections = [
    {
      title: "Apparence",
      icon: <Moon size={16} />,
      items: [
        {
          label: "Mode sombre",
          desc: "Passer en thème sombre pour réduire la fatigue oculaire",
          action: (
            <button
              onClick={toggle}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition-colors ${
                isDark ? "bg-[#15803d]/10 text-[#15803d]" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
              }`}
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
              <span>{isDark ? "Clair" : "Sombre"}</span>
            </button>
          ),
        },
      ],
    },
    {
      title: "Notifications",
      icon: <Bell size={16} />,
      items: [
        { label: "Nouvelles collectes", desc: "Quand une collecte est soumise" },
        { label: "Validations en attente", desc: "Rappel des données à valider" },
        { label: "Rapports hebdomadaires", desc: "Récapitulatif automatique chaque lundi" },
      ],
    },
    {
      title: "Données & Synchronisation",
      icon: <Database size={16} />,
      items: [
        { label: "Mode hors-ligne", desc: "Conserver les données localement pour le terrain" },
      ],
      extra: (
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">Stockage local</p>
            <p className="text-xs text-gray-500">2.4 Mo utilisés sur 50 Mo</p>
          </div>
          <div className="h-2 w-32 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
            <div className="h-full w-[5%] rounded-full bg-[#15803d]" />
          </div>
        </div>
      ),
    },
    {
      title: "Langue & Région",
      icon: <Globe size={16} />,
      items: [
        {
          label: "Langue de l'interface",
          desc: "Français (par défaut)",
          action: (
            <select className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-[#15803d] focus:ring-1 focus:ring-[#15803d] outline-none">
              <option>Français</option>
              <option>English</option>
            </select>
          ),
        },
      ],
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#15803d]/10 text-[#15803d]">
          <Settings size={22} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Réglages</h1>
          <p className="text-sm text-gray-500">Configurez votre application</p>
        </div>
      </div>

      {sections.map((section, si) => (
        <div key={si} className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0f172a]">
          <div className="border-b border-gray-200 dark:border-gray-800 px-5 py-3">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
              {section.icon} {section.title}
            </h2>
          </div>
          <div className="p-5 space-y-4">
            {section.items.map((item, ii) => (
              <div key={ii} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{item.label}</p>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
                {"action" in item && item.action ? (
                  item.action
                ) : (
                  <label className="relative inline-flex cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-9 h-5 bg-gray-200 dark:bg-gray-700 rounded-full peer peer-checked:bg-[#15803d] after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
                  </label>
                )}
              </div>
            ))}
            {section.extra}
          </div>
        </div>
      ))}

      <div className="text-center text-xs text-gray-400">
        <p>MEAL-Pro v1.0.0 — Monitoring & Evaluation with AI Logic</p>
        <p className="mt-1">Propulsé par Next.js</p>
      </div>
    </div>
  );
}
