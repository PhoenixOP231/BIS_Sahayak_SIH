import standardsIndex from '../data/standards/standards-index.json';

export interface StandardClause {
  clauseNumber: string;
  title: string;
  content: string;
  contentHi?: string;
}

export interface StandardDoc {
  id: string;
  isNumber: string;
  title: string;
  titleHi: string;
  category: string;
  sector: string;
  status: string;
  qcoOrder?: string;
  year: number;
  conformityAssessmentScheme: string;
  hsCodes: string[];
  scope: string;
  scopeHi: string;
  keyTests: { name: string; description: string; parameterLimit: string }[];
  markingRequirements: string;
  consumerTips: string[];
  industryGuidelines: string[];
  clauses: StandardClause[];
  demoNotice: string;
}

export const ALL_STANDARDS: StandardDoc[] = standardsIndex as StandardDoc[];

export function getStandardById(id: string): StandardDoc | undefined {
  if (!id) return undefined;
  const clean = id.toLowerCase().replace(/[^a-z0-9]/g, '');
  return ALL_STANDARDS.find(s => 
    s.id.toLowerCase().replace(/[^a-z0-9]/g, '') === clean || 
    s.isNumber.toLowerCase().replace(/[^a-z0-9]/g, '') === clean
  );
}

export function searchStandards(query?: string, category?: string, status?: string): StandardDoc[] {
  let results = [...ALL_STANDARDS];
  if (category && category !== 'all') {
    results = results.filter(s => s.category.toLowerCase() === category.toLowerCase());
  }
  if (status && status !== 'all') {
    if (status === 'Mandatory') {
      results = results.filter(s => s.status.includes('Mandatory'));
    } else if (status === 'Voluntary') {
      results = results.filter(s => s.status === 'Voluntary');
    }
  }
  if (query && query.trim()) {
    const q = query.toLowerCase().trim();
    results = results.filter(s => 
      s.isNumber.toLowerCase().includes(q) ||
      s.title.toLowerCase().includes(q) ||
      (s.titleHi && s.titleHi.toLowerCase().includes(q)) ||
      s.scope.toLowerCase().includes(q) ||
      (s.scopeHi && s.scopeHi.toLowerCase().includes(q)) ||
      s.category.toLowerCase().includes(q) ||
      s.sector.toLowerCase().includes(q) ||
      s.clauses.some(c => c.content.toLowerCase().includes(q) || c.title.toLowerCase().includes(q))
    );
  }
  return results;
}
