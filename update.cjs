const fs = require('fs');
const files = fs.readdirSync('src/components/forms').filter(f => f.endsWith('Wizard.tsx'));
files.forEach(f => {
  const p = 'src/components/forms/' + f;
  let c = fs.readFileSync(p, 'utf8');
  c = c.replace(/placeholder="Buscar[^"]*"/g, 'placeholder="Colar Link do YouTube ou Nome da Música"');
  fs.writeFileSync(p, c);
  console.log('Updated ' + f);
});
