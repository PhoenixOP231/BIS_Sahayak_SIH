const fs = require('fs');
const path = require('path');

const mod1 = JSON.parse(fs.readFileSync(path.join(__dirname, 'data-kitchen-appliances.json'), 'utf8'));
const mod2 = JSON.parse(fs.readFileSync(path.join(__dirname, 'data-construction-pipes.json'), 'utf8'));
const mod3 = JSON.parse(fs.readFileSync(path.join(__dirname, 'data-safety-toys-water.json'), 'utf8'));
const mod4 = JSON.parse(fs.readFileSync(path.join(__dirname, 'data-industrial-cylinders.json'), 'utf8'));

const allStandards = [...mod1, ...mod2, ...mod3, ...mod4];
console.log('Total standards assembled:', allStandards.length);

const targetDir = path.join(__dirname, '..', 'data', 'standards');
fs.mkdirSync(targetDir, { recursive: true });

for (const doc of allStandards) {
  const filePath = path.join(targetDir, doc.id + '.json');
  fs.writeFileSync(filePath, JSON.stringify(doc, null, 2), 'utf8');
}

const indexPath = path.join(targetDir, 'standards-index.json');
fs.writeFileSync(indexPath, JSON.stringify(allStandards, null, 2), 'utf8');

const libCode = [
  'export interface StandardClause {',
  '  clauseNumber: string;',
  '  title: string;',
  '  content: string;',
  '  contentHi?: string;',
  '}',
  '',
  'export interface StandardDoc {',
  '  id: string;',
  '  isNumber: string;',
  '  title: string;',
  '  titleHi: string;',
  '  category: string;',
  '  sector: string;',
  '  status: string;',
  '  qcoOrder?: string;',
  '  year: number;',
  '  conformityAssessmentScheme: string;',
  '  hsCodes: string[];',
  '  scope: string;',
  '  scopeHi: string;',
  '  keyTests: { name: string; description: string; parameterLimit: string }[];',
  '  markingRequirements: string;',
  '  consumerTips: string[];',
  '  industryGuidelines: string[];',
  '  clauses: StandardClause[];',
  '  demoNotice: string;',
  '}',
  '',
  'export const ALL_STANDARDS: StandardDoc[] = ' + JSON.stringify(allStandards, null, 2) + ';',
  '',
  'export function getStandardById(id: string): StandardDoc | undefined {',
  '  const clean = id.toLowerCase().replace(/[^a-z0-9]/g, " \);',
 ' return ALL_STANDARDS.find(s => s.id.toLowerCase().replace(/[^a-z0-9]/g, \\) === clean || s.isNumber.toLowerCase().replace(/[^a-z0-9]/g, \\) === clean);',
 '}',
 '',
 'export function searchStandards(query?: string, category?: string, status?: string): StandardDoc[] {',
 ' let results = [...ALL_STANDARDS];',
 ' if (category && category !== \all\) {',
 ' results = results.filter(s => s.category.toLowerCase().includes(category.toLowerCase()));',
 ' }',
 ' if (status && status !== \all\) {',
 ' results = results.filter(s => s.status.toLowerCase().includes(status.toLowerCase()));',
 ' }',
 ' if (query && query.trim()) {',
 ' const q = query.toLowerCase().trim();',
 ' results = results.filter(s => ',
 ' s.isNumber.toLowerCase().includes(q) ||',
 ' s.title.toLowerCase().includes(q) ||',
 ' s.titleHi.toLowerCase().includes(q) ||',
 ' s.scope.toLowerCase().includes(q) ||',
 ' s.scopeHi.toLowerCase().includes(q) ||',
 ' s.category.toLowerCase().includes(q) ||',
 ' s.sector.toLowerCase().includes(q) ||',
 ' s.clauses.some(c => c.content.toLowerCase().includes(q) || c.title.toLowerCase().includes(q))',
 ' );',
 ' }',
 ' return results;',
 '}'
].join('\n');

fs.writeFileSync(path.join(__dirname, '..', 'lib', 'standards-data.ts'), libCode, 'utf8');
console.log('Saved data/standards and lib/standards-data.ts successfully!');