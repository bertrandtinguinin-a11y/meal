// Script pour générer les icônes PNG du manifest PWA
// Exécuter : node scripts/generate-icons.js

const fs = require("fs");
const path = require("path");

// Fichier SVG source
const svg192 = `<svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" viewBox="0 0 192 192">
  <rect width="192" height="192" rx="32" fill="#15803d"/>
  <text x="96" y="130" text-anchor="middle" font-size="90" font-weight="bold" fill="white" font-family="system-ui, sans-serif">M</text>
  <rect x="36" y="148" width="12" height="20" rx="3" fill="#22c55e" opacity="0.8"/>
  <rect x="58" y="136" width="12" height="32" rx="3" fill="#22c55e" opacity="0.8"/>
  <rect x="80" y="124" width="12" height="44" rx="3" fill="#22c55e" opacity="0.8"/>
  <rect x="102" y="140" width="12" height="28" rx="3" fill="#22c55e" opacity="0.8"/>
  <rect x="124" y="128" width="12" height="40" rx="3" fill="#22c55e" opacity="0.8"/>
  <rect x="146" y="144" width="12" height="24" rx="3" fill="#22c55e" opacity="0.8"/>
</svg>`;

const svg512 = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="64" fill="#15803d"/>
  <text x="256" y="320" text-anchor="middle" font-size="200" font-weight="bold" fill="white" font-family="system-ui, sans-serif">M</text>
  <rect x="80" y="380" width="30" height="52" rx="6" fill="#22c55e" opacity="0.8"/>
  <rect x="130" y="352" width="30" height="80" rx="6" fill="#22c55e" opacity="0.8"/>
  <rect x="180" y="324" width="30" height="108" rx="6" fill="#22c55e" opacity="0.8"/>
  <rect x="230" y="360" width="30" height="72" rx="6" fill="#22c55e" opacity="0.8"/>
  <rect x="280" y="336" width="30" height="96" rx="6" fill="#22c55e" opacity="0.8"/>
  <rect x="330" y="370" width="30" height="62" rx="6" fill="#22c55e" opacity="0.8"/>
  <rect x="380" y="348" width="30" height="84" rx="6" fill="#22c55e" opacity="0.8"/>
  <rect x="400" y="390" width="30" height="42" rx="6" fill="#22c55e" opacity="0.8"/>
</svg>`;

// Écrire les fichiers SVG
const iconsDir = path.join(__dirname, "..", "public", "icons");
fs.writeFileSync(path.join(iconsDir, "icon-192.svg"), svg192);
fs.writeFileSync(path.join(iconsDir, "icon-512.svg"), svg512);

console.log("✅ Icônes SVG générées dans public/icons/");
console.log("📝 Pour les convertir en PNG, utilisez :");
console.log("   1. https://convertio.co/fr/svg-png/");
console.log("   2. Ou installez sharp: npm install sharp");
console.log("   3. Ou utilisez un outil en ligne comme svgtopng.com");
console.log("\nLes icônes SVG sont déjà fonctionnelles sur la plupart des navigateurs.");
