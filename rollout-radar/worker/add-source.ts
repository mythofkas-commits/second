import fs from 'fs';
import path from 'path';
import yaml from 'yaml';

const args = process.argv.slice(2);
let feature = '';
let url = '';
let type = 'NEWSROOM';

for (let i = 0; i < args.length; i += 2) {
  const key = args[i];
  const value = args[i + 1];
  if (!value) continue;
  if (key === '--feature') feature = value;
  if (key === '--url') url = value;
  if (key === '--type') type = value;
}

if (!feature || !url) {
  console.error('Usage: pnpm worker:add-source --feature <slug> --url <url> [--type TYPE]');
  process.exit(1);
}

const filePath = path.join(process.cwd(), 'worker', 'sources.yml');
let data: any = { sources: [] };
if (fs.existsSync(filePath)) {
  data = yaml.parse(fs.readFileSync(filePath, 'utf8')) ?? { sources: [] };
}

data.sources.push({ feature, url, type });
fs.writeFileSync(filePath, yaml.stringify(data));
console.log('Source added');
