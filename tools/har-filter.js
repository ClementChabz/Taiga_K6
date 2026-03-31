const fs = require('fs/promises');
const path = require('path');

(async () => {
  const [input, output] = process.argv.slice(2);
  
  if (!input || !output) {
    console.error('❌ Usage: node filter-har.js input.har output.har');
    process.exit(1);
  }

  try {
    const inputPath = path.resolve(input);
    console.log('📂 Lecture:', inputPath);
    
    const har = JSON.parse(await fs.readFile(inputPath, 'utf8'));
    console.log(`📊 ${har.log.entries.length} entrées originales`);
    
    const filtered = har.log.entries.filter(entry => {
      const url = entry.request.url.toLowerCase();
      
      // SUPPRIME : CSS/JS/Images/Fonts
      if (/\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|ttf|eot|otf)/i.test(url)) {
        return false;
      }
      
      // GARDE : OrangeHRM + localhost + API typiques
      if (url.includes('orangehrm')) {
        return true;
      }
      
      return false;
    });
    
    const filteredHar = { log: { ...har.log, entries: filtered } };
    await fs.writeFile(path.resolve(output), JSON.stringify(filteredHar, null, 2));
    
    console.log(`✅ ${filtered.length}/${har.log.entries.length} gardées`);
    console.log(`💾 ${path.resolve(output)}`);
    
  } catch (error) {
    console.error('💥 Erreur:', error.message);
    process.exit(1);
  }
})();
