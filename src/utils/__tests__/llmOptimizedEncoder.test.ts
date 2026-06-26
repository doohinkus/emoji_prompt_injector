import { LLMOptimizedEncoder } from '../llmOptimizedEncoder'

describe('LLMOptimizedEncoder', () => {
  describe('encode / decode round-trip', () => {
    it('encodes and decodes a simple ASCII message', () => {
      const encoder = new LLMOptimizedEncoder()
      const original = 'Hello, World!'
      const encoded = encoder.encode(original)
      const decoded = encoder.decode(encoded)
      expect(decoded).toBe(original)
    })

    it('encodes and decodes numbers and symbols', () => {
      const encoder = new LLMOptimizedEncoder()
      const original = 'ABC123!@#$%'
      const encoded = encoder.encode(original)
      const decoded = encoder.decode(encoded)
      expect(decoded).toBe(original)
    })

    it('handles empty string', () => {
      const encoder = new LLMOptimizedEncoder()
      expect(encoder.encode('')).toBe('')
      expect(encoder.decode('')).toBe('')
    })

    it('includes default empty string prefix', () => {
      const encoder = new LLMOptimizedEncoder()
      const encoded = encoder.encode('test')
      expect(encoded).not.toMatch(/^[🔄⚙️]/u)
    })

    it('decode preserves non-tag plain text', () => {
      const encoder = new LLMOptimizedEncoder()
      expect(encoder.decode('plain')).toBe('plain')
    })

    it('encodes and decodes a message with no emoji prefix', () => {
      const encoder = new LLMOptimizedEncoder()
      const original = 'test'
      const encoded = encoder.encode(original)
      const decoded = encoder.decode(encoded)
      expect(decoded).toBe(original)
    })
  })

  describe('encodeWithHint', () => {
    it('appends the hint text', () => {
      const encoder = new LLMOptimizedEncoder()
      const result = encoder.encodeWithHint('secret')
      expect(result).toContain('[HIDDEN_MESSAGE]')
      expect(result.startsWith(encoder.encode('secret'))).toBe(true)
    })

    it('uses custom hint', () => {
      const encoder = new LLMOptimizedEncoder()
      const result = encoder.encodeWithHint('data', '[CUSTOM]')
      expect(result).toContain('[CUSTOM]')
    })
  })

  describe('encodeBatch', () => {
    it('returns array of encoded strings', () => {
      const encoder = new LLMOptimizedEncoder()
      const prompts = ['first', 'second', 'third']
      const results = encoder.encodeBatch(prompts)
      expect(results).toHaveLength(3)
      results.forEach((r, i) => {
        expect(encoder.decode(r)).toContain(prompts[i])
      })
    })
  })

  describe('containsEncodedContent', () => {
    it('returns true for string with encoded content', () => {
      const encoder = new LLMOptimizedEncoder()
      const encoded = encoder.encode('secret')
      expect(encoder.containsEncodedContent(encoded)).toBe(true)
    })

    it('returns false for plain string', () => {
      const encoder = new LLMOptimizedEncoder()
      expect(encoder.containsEncodedContent('hello world')).toBe(false)
    })

    it('returns false for emoji-only string', () => {
      const encoder = new LLMOptimizedEncoder()
      expect(encoder.containsEncodedContent('🔥✨')).toBe(false)
    })
  })

  describe('extractAllEncoded', () => {
    it('extracts a single encoded message', () => {
      const encoder = new LLMOptimizedEncoder()
      const encoded = encoder.encode('secret')
      const messages = encoder.extractAllEncoded(encoded)
      expect(messages).toEqual(['secret'])
    })

    it('returns empty array for plain text', () => {
      const encoder = new LLMOptimizedEncoder()
      expect(encoder.extractAllEncoded('no tags here')).toEqual([])
    })

    it('extracts multiple encoded segments separated by plain text', () => {
      const encoder = new LLMOptimizedEncoder()
      const a = encoder.encode('first')
      const b = encoder.encode('second')
      const combined = a + ' plain ' + b
      const messages = encoder.extractAllEncoded(combined)
      expect(messages).toEqual(['first', 'second'])
    })
  })

  describe('createPromptPattern', () => {
    it('returns correct structure', () => {
      const encoder = new LLMOptimizedEncoder()
      const pattern = encoder.createPromptPattern('system prompt', 'user prompt')
      expect(pattern).toHaveProperty('system')
      expect(pattern).toHaveProperty('user', 'user prompt')
      expect(pattern).toHaveProperty('instruction')
      expect(encoder.decode(pattern.system)).toBe('system prompt')
    })
  })
})
