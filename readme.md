# MEAL — Monitoring & Evaluation with AI Logic

📊 Application web progressive (PWA) pour le suivi de KPIs avec intelligence artificielle intégrée.

## 🚀 Tech Stack

- **Framework** : Next.js (App Router)
- **Styling** : Tailwind CSS v4
- **Base de Données** : Supabase (PostgreSQL)
- **IA** : Gemini API via API Route
- **Graphiques** : Recharts
- **Hébergement** : Vercel (Hobby — gratuit)
- **PWA** : Manifest + Service Worker (installable sur mobile)

## 📁 Structure du projet

```
meal/
├── src/
│   ├── app/
│   │   ├── api/ai/route.ts   ← API route IA (Gemini)
│   │   ├── api/kpis/route.ts  ← API route KPIs
│   │   ├── dashboard/page.tsx ← Dashboard principal
│   │   ├── layout.tsx         ← Layout global + PWA meta
│   │   ├── page.tsx           ← Page d'accueil
│   │   └── globals.css        ← Styles Tailwind + thème
│   ├── components/
│   │   ├── KpiCard.tsx         ← Carte KPI avec barre de progression
│   │   ├── KpiChart.tsx        ← Graphique d'évolution
│   │   └── AiAssistant.tsx    ← Assistant IA (analyse + chat)
│   └── lib/
│       └── supabase.ts        ← Client Supabase
├── public/
│   ├── manifest.json           ← PWA manifest
│   ├── sw.js                   ← Service Worker
│   └── icons/                  ← Icônes PWA
├── scripts/
│   └── generate-icons.js       ← Générateur d'icônes
├── vercel.json                 ← Config Vercel
├── next.config.ts
└── tailwind.config.ts
```

## ⚡ Installation

```bash
# 1. Cloner et installer
git clone <votre-repo> meal
cd meal
npm install

# 2. Copier .env.local et configurer
cp .env.local.example .env.local
# Ajouter vos clés Supabase et Gemini

# 3. Lancer en développement
npm run dev
# → http://localhost:3000

# 4. Build pour production
npm run build
npm start
```

## 🗄️ Base de Données Supabase

### Créer un compte Supabase (gratuit)
1. Allez sur https://supabase.com
2. Créez un compte → **New project**
3. Copiez l'URL et l'Anon Key dans `.env.local`

### Schéma de base
```sql
-- Table des KPIs
CREATE TABLE kpis (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nom TEXT NOT NULL,
  valeur DECIMAL NOT NULL,
  objectif DECIMAL NOT NULL,
  unite TEXT DEFAULT '',
  categorie TEXT DEFAULT 'Général',
  tendance TEXT DEFAULT 'stable',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table de l'historique
CREATE TABLE historique_kpis (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  kpi_id UUID REFERENCES kpis(id) ON DELETE CASCADE,
  valeur DECIMAL NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 🤖 Configuration de l'IA

### Gemini API (gratuit)
1. Allez sur https://aistudio.google.com/app/apikey
2. Créez une **API Key**
3. Ajoutez dans `.env.local` :

```env
GEMINI_API_KEY=votre_cle_ici
```

### Sans clé API (mode local)
L'application fonctionne sans clé API :
- Analyse intelligente côté client (régression linéaire, détection anomalies)
- Chat avec réponses contextuelles basées sur les données locales
- Recommandations générées par règles métier

## 📱 Déploiement PWA

### Sur Vercel (recommandé — gratuit)
```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
cd meal
vercel

# Suivre les instructions → votre-app.vercel.app
```

### Ou avec Git
```bash
# 1. Créer un repo GitHub
# 2. Connecter à Vercel : https://vercel.com/new
# 3. Importer le repo GitHub
# 4. Ajouter les variables d'environnement
```

### Installer sur mobile
1. Ouvrir l'app dans Chrome/Safari sur mobile
2. Menu → "Ajouter à l'écran d'accueil"
3. L'icône MEAL apparaît → elle s'ouvre comme une app native

## 🎯 Fonctionnalités

| Fonctionnalité | Statut |
|---------------|--------|
| ✅ Dashboard KPIs avec graphiques | ✅ Fait |
| ✅ Analyse intelligente (local) | ✅ Fait |
| ✅ Chat IA (Gemini + fallback local) | ✅ Fait |
| ✅ Mode sombre | ✅ Fait |
| ✅ PWA installable | ✅ Fait |
| ✅ Export Excel/PDF | 🔜 À venir |
| ✅ Import données | 🔜 À venir |
| ✅ Auth multi-utilisateurs | 🔜 À venir |
| ✅ Notifications push | 🔜 À venir |
| ✅ Temps réel (Supabase Realtime) | 🔜 À venir |

## 📊 KPIs par défaut (démo)

L'application inclut 6 KPIs de démonstration :
- **Finance** : CA, Marge, Dépenses
- **Production** : Production journalière
- **RH** : Taux d'occupation
- **Commercial** : Nouveaux clients

## 📝 Licence

Usage non-commercial gratuit (plan Vercel Hobby).
Pour usage commercial, migrer vers un plan payant Vercel.

---

**Construit avec ❤️ pour le Bénin**
  
