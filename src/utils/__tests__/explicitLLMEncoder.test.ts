import {
  ExplicitLLMEncoder,
  decodeForLLM,
  isEncoded,
} from '../explicitLLMEncoder'

describe('ExplicitLLMEncoder', () => {
  describe('encodeWithInstructions', () => {
    it('returns a string with encoded content and instructions', () => {
      const encoder = new ExplicitLLMEncoder()
      const result = encoder.encodeWithInstructions('test prompt')
      expect(result).toContain('CONTAINS_ENCODED_PROMPT')
      expect(result).toContain('[DECODING_METHOD')
      expect(result).toContain('[DECODED_TEXT_START]test prompt[DECODED_TEXT_END]')
    })
  })

  describe('decodeFromTags', () => {
    it('decodes an encoded string back to original', () => {
      const encoder = new ExplicitLLMEncoder()
      const encoded = encoder.encodeWithInstructions('hello')
      const decoded = encoder.decodeFromTags(encoded)
      expect(decoded).toContain('hello')
    })
  })
})

describe('decodeForLLM', () => {
  it('extracts encoded text from a string', () => {
    const encoder = new ExplicitLLMEncoder()
    const encoded = encoder.encodeWithInstructions('secret')
    const result = decodeForLLM(encoded)
    expect(result).toContain('secret')
  })

  it('returns empty string for plain text', () => {
    expect(decodeForLLM('hello')).toBe('')
  })
})

describe('isEncoded', () => {
  it('returns true for strings with tag characters', () => {
    const encoder = new ExplicitLLMEncoder()
    const encoded = encoder.encodeWithInstructions('test')
    expect(isEncoded(encoded)).toBe(true)
  })

  it('returns false for plain strings', () => {
    expect(isEncoded('just a regular string')).toBe(false)
  })
})
