const fs = require('fs');
const path = require('path');

const apiUrl = process.env.AMPLIFY_API_URL || process.env.API_URL;

if (!apiUrl) {
  console.log('AMPLIFY_API_URL/API_URL no definido; se usara environment.production.ts actual.');
  process.exit(0);
}

let parsedUrl;
try {
  parsedUrl = new URL(apiUrl);
} catch (_error) {
  console.error(`API_URL invalida: ${apiUrl}`);
  process.exit(1);
}

if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
  console.error('API_URL debe iniciar con http:// o https://');
  process.exit(1);
}

const outputPath = path.join(__dirname, '..', 'src', 'environments', 'environment.production.ts');
const normalizedApiUrl = apiUrl.replace(/\/$/, '');
const content = `export const environment = {
  production: true,
  apiUrl: '${normalizedApiUrl}',
};
`;

fs.writeFileSync(outputPath, content, 'utf8');
console.log(`environment.production.ts configurado con ${normalizedApiUrl}`);
