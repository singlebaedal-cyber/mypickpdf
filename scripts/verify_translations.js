const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '../src/lib/translations');

// We test importing each file via simple parsing or evaluation
const langFiles = [
  { code: 'ar', varName: 'ar', file: 'ar.ts' },
  { code: 'bg', varName: 'bg', file: 'bg.ts' },
  { code: 'ca', varName: 'ca', file: 'ca.ts' },
  { code: 'de', varName: 'de', file: 'de.ts' },
  { code: 'el', varName: 'el', file: 'el.ts' },
  { code: 'en', varName: 'en', file: 'en.ts' },
  { code: 'es', varName: 'es', file: 'es.ts' },
  { code: 'fr', varName: 'fr', file: 'fr.ts' },
  { code: 'hi', varName: 'hi', file: 'hi.ts' },
  { code: 'id', varName: 'id', file: 'id.ts' },
  { code: 'it', varName: 'it', file: 'it.ts' },
  { code: 'ja', varName: 'ja', file: 'ja.ts' },
  { code: 'ko', varName: 'ko', file: 'ko.ts' },
  { code: 'ms', varName: 'ms', file: 'ms.ts' },
  { code: 'nl', varName: 'nl', file: 'nl.ts' },
  { code: 'pl', varName: 'pl', file: 'pl.ts' },
  { code: 'pt', varName: 'pt', file: 'pt.ts' },
  { code: 'ru', varName: 'ru', file: 'ru.ts' },
  { code: 'sv', varName: 'sv', file: 'sv.ts' },
  { code: 'sw', varName: 'sw', file: 'sw.ts' },
  { code: 'th', varName: 'th', file: 'th.ts' },
  { code: 'tr', varName: 'tr', file: 'tr.ts' },
  { code: 'uk', varName: 'uk', file: 'uk.ts' },
  { code: 'vi', varName: 'vi', file: 'vi.ts' },
  { code: 'zh-CN', varName: 'zhCN', file: 'zh-CN.ts' },
  { code: 'zh-TW', varName: 'zhTW', file: 'zh-TW.ts' }
];

// Read ko as gold standard keys
const koContent = fs.readFileSync(path.join(outDir, 'ko.ts'), 'utf8');
const koObj = eval('(' + koContent.replace(/import[\s\S]*?export const ko: TranslationDictionary = /, '').replace(/;\s*$/, '') + ')');
const goldKeys = Object.keys(koObj).sort();

console.log(`Gold standard has ${goldKeys.length} keys.`);

let allPassed = true;

for (const lf of langFiles) {
  const content = fs.readFileSync(path.join(outDir, lf.file), 'utf8');
  const jsonStr = content.replace(/import[\s\S]*?export const [a-zA-Z0-9]+: TranslationDictionary = /, '').replace(/;\s*$/, '');
  let obj;
  try {
    obj = eval('(' + jsonStr + ')');
  } catch (err) {
    console.error(`Syntax error in ${lf.file}:`, err.message);
    allPassed = false;
    continue;
  }
  
  const keys = Object.keys(obj);
  const missing = goldKeys.filter(k => !(k in obj) || obj[k] === undefined || obj[k] === null || obj[k] === '');
  if (missing.length > 0) {
    console.error(`Language ${lf.code} (${lf.file}) is missing ${missing.length} keys:`, missing);
    allPassed = false;
  } else {
    console.log(`✓ ${lf.code.padEnd(6)} (${lf.file.padEnd(9)}) has all ${keys.length} keys.`);
  }
}

if (!allPassed) {
  console.error('FAILED: Not all languages passed verification!');
  process.exit(1);
}

// Generate index.ts
const imports = langFiles.map(lf => `import { ${lf.varName} } from "./${lf.file.replace('.ts', '')}";`).join('\n');

const indexContent = `"use client";

${imports}
import { TranslationKey, TranslationDictionary } from "./types";

export * from "./types";

export const translations: Record<string, TranslationDictionary> = {
  ar,
  bg,
  ca,
  de,
  el,
  en,
  es,
  fr,
  hi,
  id,
  it,
  ja,
  ko,
  ms,
  nl,
  pl,
  pt,
  ru,
  sv,
  sw,
  th,
  tr,
  uk,
  vi,
  "zh-CN": zhCN,
  zh: zhCN, // alias for standard zh
  "zh-TW": zhTW,
};
`;

fs.writeFileSync(path.join(outDir, 'index.ts'), indexContent);
console.log('Successfully generated src/lib/translations/index.ts with 26 languages + aliases!');
