import { readFileSync, writeFileSync } from 'fs';

// Read current version from root package.json
const rootPkg = JSON.parse(readFileSync('package.json', 'utf8'));
const version = rootPkg.version;

// List of example package.json files to fix
const examples = [
  'examples/vite-starter/package.json',
  'examples/postcss-starter/package.json'
];

console.log(`\n🔧 Fixing example dependencies to version ^${version}...\n`);

examples.forEach(path => {
  const content = readFileSync(path, 'utf8');
  const pkg = JSON.parse(content);

  // Replace file:../.. with actual version
  if (pkg.dependencies?.['@valiify/shortapp-ui']) {
    pkg.dependencies['@valiify/shortapp-ui'] = `^${version}`;
    writeFileSync(path, JSON.stringify(pkg, null, 2) + '\n');
    console.log(`  ✓ ${path} → ^${version}`);
  }
});

console.log('\n✅ Example dependencies fixed\n');
