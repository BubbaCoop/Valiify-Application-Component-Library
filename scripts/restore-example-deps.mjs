import { readFileSync, writeFileSync } from 'fs';

const examples = [
  'examples/vite-starter/package.json',
  'examples/postcss-starter/package.json'
];

console.log('\n🔄 Restoring example dependencies to file:../..\n');

examples.forEach(path => {
  const content = readFileSync(path, 'utf8');
  const pkg = JSON.parse(content);

  if (pkg.dependencies?.['@valiify/shortapp-ui']) {
    pkg.dependencies['@valiify/shortapp-ui'] = 'file:../..';
    writeFileSync(path, JSON.stringify(pkg, null, 2) + '\n');
    console.log(`  ✓ ${path} → file:../..`);
  }
});

console.log('\n✅ Example dependencies restored\n');
