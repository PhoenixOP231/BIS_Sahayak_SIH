import { describe, it, expect } from 'vitest';
import { generateRAGAnswer } from '../lib/gemini';

describe('RAG Chat Assistant & Citation Generation', () => {
  it('should answer consumer pressure cooker question with IS 2347 citation', async () => {
    const response = await generateRAGAnswer('Is my pressure cooker BIS certified?', [], 'consumer', 'en');
    expect(response.answer).toBeDefined();
    expect(response.citations.length).toBeGreaterThan(0);
    expect(response.citations.some(c => c.isNumber.includes('IS 2347'))).toBe(true);
    expect(response.mode).toBe('consumer');
  });

  it('should answer in Hindi when Hindi language is requested', async () => {
    const response = await generateRAGAnswer('क्या पैकेज्ड पेयजल IS 14543 पर ISI मार्क आवश्यक है?', [], 'consumer', 'hi');
    expect(response.answer).toBeDefined();
    expect(response.language).toBe('hi');
    expect(response.citations.some(c => c.isNumber.includes('IS 14543') || c.isNumber.includes('IS 10500'))).toBe(true);
  });

  it('should handle natural conversational greetings gracefully', async () => {
    const response = await generateRAGAnswer('Hello, who are you and how can you help me?', [], 'consumer', 'en');
    expect(response.answer).toBeDefined();
    expect(response.answer.toLowerCase()).toContain('bis sahayak');
  });

  it('should handle complaint and fake product guidance', async () => {
    const response = await generateRAGAnswer('How do I report a fake ISI mark on a product?', [], 'consumer', 'en');
    expect(response.answer).toBeDefined();
    expect(response.answer).toContain('BIS Care');
  });
});
