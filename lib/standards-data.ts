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
  if (!id || id === 'undefined' || id === 'null') {
    return ALL_STANDARDS.find(s => s.id === 'IS-2347-2017') || ALL_STANDARDS[0];
  }
  const clean = id.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  // 1. Direct match on clean ID or clean isNumber
  const direct = ALL_STANDARDS.find(s => 
    s.id.toLowerCase().replace(/[^a-z0-9]/g, '') === clean || 
    s.isNumber.toLowerCase().replace(/[^a-z0-9]/g, '') === clean
  );
  if (direct) return direct;

  // 2. Numeric fallback match (e.g. "2347", "14543", "1786")
  const digits = id.replace(/[^0-9]/g, '');
  if (digits.length >= 3) {
    const numericMatch = ALL_STANDARDS.find(s => 
      s.isNumber.replace(/[^0-9]/g, '').includes(digits) ||
      s.id.replace(/[^0-9]/g, '').includes(digits)
    );
    if (numericMatch) return numericMatch;
  }

  return undefined;
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
