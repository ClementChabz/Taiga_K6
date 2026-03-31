const fs = require('fs');

const fileName = process.argv[2];
if (!fileName) {
    console.error("Usage: node clean-k6-final.js <script.js>");
    process.exit(1);
}

const targetDomain = "https://opensource-demo.orangehrmlive.com";
let lines = fs.readFileSync(fileName, 'utf8').split('\n');

let cleanedLines = lines.map(line => {
    // 1. On ignore les lignes de cookies (suppression totale)
    if (line.includes('cookies:')) return null;

    // 2. Si la ligne contient notre URL cible, on transforme les ' en `
    if (line.includes(targetDomain)) {
        // Remplace ' par ` uniquement sur cette ligne
        return line.replace(/'/g, '`');
    }

    // 3. Pour les autres lignes (Headers, options), on ne touche à rien
    return line;
});

// Filtrer les lignes nulles (cookies) et rejoindre
const finalContent = cleanedLines.filter(l => l !== null).join('\n');

fs.writeFileSync(`clean_${fileName}`, finalContent);
console.log(`✅ Nettoyage sélectif terminé sur le domaine : ${targetDomain}`);