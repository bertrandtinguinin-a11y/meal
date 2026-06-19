"use client";

import { Shield, Key, AlertTriangle, Clock, CheckCircle } from "lucide-react";

const logs = [
  { action: "Connexion réussie", ip: "192.168.1.45", date: "19/06/2026 14:32", status: "succès" },
  { action: "Modification mot de passe", ip: "192.168.1.45", date: "19/06/2026 11:15", status: "succès" },
  { action: "Tentative de connexion", ip: "10.0.0.88", date: "19/06/2026 09:03", status: "échec" },
  { action: "Export de données", ip: "192.168.1.45", date: "18/06/2026 17:45", status: "succès" },
  { action: "Connexion réussie", ip: "192.168.1.45", date: "18/06/2026 08:30", status: "succès" },
];

const settings = [
  { label: "Authentification à deux facteurs (2FA)", desc: "Renforcez la sécurité de votre compte", enabled: false },
  { label: "Notifications de connexion", desc: "Soyez averti en cas de nouvelle connexion", enabled: true },
  { label: "Session automatique", desc: "Restez connecté pendant 30 jours", enabled: true },
];

export default function SecuritePage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#15803d]/10 text-[#15803d]">
          <Shield size={22} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Sécurité</h1>
          <p className="text-sm text-gray-500">Journal des activités et paramètres de sécurité</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={<CheckCircle size={16} className="text-green-500" />} label="Connexions réussies" value="4" sub="cette semaine" />
        <StatCard icon={<AlertTriangle size={16} className="text-amber-500" />} label="Tentatives échouées" value="1" sub="cette semaine" />
        <StatCard icon={<Key size={16} className="text-blue-500" />} label="Dernier accès" value="14:32" sub="19 juin 2026" />
        <StatCard icon={<Clock size={16} className="text-purple-500" />} label="Sessions actives" value="1" sub="appareil actuel" />
      </div>

      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0f172a]">
        <div className="border-b border-gray-200 dark:border-gray-800 px-5 py-3">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Journal d'activité</h2>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {logs.map((log, i) => (
            <div key={i} className="flex items-center justify-between px-5 py-3">
              <div className="flex items-center gap-3">
                <div className={`h-2 w-2 rounded-full ${log.status === "succès" ? "bg-green-500" : "bg-red-500"}`} />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{log.action}</p>
                  <p className="text-xs text-gray-500">{log.ip}</p>
                </div>
              </div>
              <span className="text-xs text-gray-400">{log.date}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0f172a] p-5">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Paramètres</h2>
        <div className="space-y-4">
          {settings.map((item, i) => (
            <div key={i} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{item.label}</p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
              <label className="relative inline-flex cursor-pointer">
                <input type="checkbox" defaultChecked={item.enabled} className="sr-only peer" />
                <div className="w-9 h-5 bg-gray-200 dark:bg-gray-700 rounded-full peer peer-checked:bg-[#15803d] after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub: string }) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0f172a] p-4">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">{icon}{label}</div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      <p className="text-xs text-gray-400">{sub}</p>
    </div>
  );
}
