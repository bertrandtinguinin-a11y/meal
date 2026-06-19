"use client";

import { Users, UserPlus, Shield, User, BadgeCheck } from "lucide-react";

const TEAM = [
  { nom: "Admin MEAL", email: "admin@meal.app", role: "Administrateur", status: "actif", initiales: "AM" },
  { nom: "Agent Terrain", email: "collecte@meal.app", role: "Collecteur", status: "actif", initiales: "AT" },
  { nom: "Superviseur", email: "superviseur@meal.app", role: "Superviseur", status: "actif", initiales: "SU" },
  { nom: "Marie Kossi", email: "marie@meal.app", role: "Collectrice", status: "inactif", initiales: "MK" },
  { nom: "Paul Djibril", email: "paul@meal.app", role: "Superviseur", status: "actif", initiales: "PD" },
];

export default function UtilisateursPage() {
  const RoleIcon = ({ role }: { role: string }) => {
    if (role === "Administrateur") return <Shield size={16} className="text-red-500" />;
    if (role === "Superviseur") return <BadgeCheck size={16} className="text-blue-500" />;
    return <User size={16} className="text-gray-500" />;
  };

  const actifs = TEAM.filter(u => u.status === "actif").length;
  const inactifs = TEAM.filter(u => u.status === "inactif").length;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#15803d]/10 text-[#15803d]">
            <Users size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Utilisateurs</h1>
            <p className="text-sm text-gray-500">{TEAM.length} membres</p>
          </div>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-[#15803d] px-4 py-2 text-sm font-medium text-white hover:bg-[#166534] transition-colors">
          <UserPlus size={18} />
          <span className="hidden sm:inline">Ajouter</span>
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatBox value={String(actifs)} label="Actifs" />
        <StatBox value={String(inactifs)} label="Inactifs" />
        <StatBox value="3" label="Rôles" />
      </div>

      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0f172a] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Utilisateur</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rôle</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th className="px-5 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {TEAM.map((member, i) => (
                <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#15803d]/20 text-xs font-bold text-[#15803d]">
                        {member.initiales}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{member.nom}</p>
                        <p className="text-xs text-gray-500">{member.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1.5">
                      <RoleIcon role={member.role} />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{member.role}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      member.status === "actif"
                        ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-500"
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${member.status === "actif" ? "bg-green-500" : "bg-gray-400"}`} />
                      {member.status === "actif" ? "Actif" : "Inactif"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button className="text-sm text-[#15803d] hover:underline font-medium">Modifier</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatBox({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0f172a] p-4 text-center">
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}
