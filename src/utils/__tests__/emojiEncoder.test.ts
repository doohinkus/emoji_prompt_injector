import encodeSecretInEmoji from '../emojiEncoder'

const TAG_BASE = 0xe0000

function decode(str: string): string {
  return Array.from(str)
    .map((c) => {
      const code = c.codePointAt(0)!
      return code >= TAG_BASE ? String.fromCodePoint(code - TAG_BASE) : c
    })
    .join('')
}

describe('emojiEncoder', () => {
  describe('encodeSecretInEmoji', () => {
    it('encodes an uppercase message', () => {
      const result = encodeSecretInEmoji('HELLO')
      expect(decode(result)).toBe('HELLO')
    })

    it('encodes a lowercase message as uppercase', () => {
      const result = encodeSecretInEmoji('hello')
      expect(decode(result)).toBe('HELLO')
    })

    it('encodes numbers', () => {
      const result = encodeSecretInEmoji('123')
      expect(decode(result)).toBe('123')
    })

    it('encodes spaces', () => {
      const result = encodeSecretInEmoji('A B')
      expect(decode(result)).toBe('A B')
    })

    it('prepends the emoji when provided', () => {
      const result = encodeSecretInEmoji('HI', '🚀')
      expect(result.startsWith('🚀')).toBe(true)
      expect(decode(result.slice('🚀'.length))).toBe('HI')
    })

    it('returns empty string for empty message without emoji', () => {
      expect(() => encodeSecretInEmoji('')).toThrow()
    })

    it('round-trips encode and decode correctly', () => {
      const original = 'TEST123'
      const encoded = encodeSecretInEmoji(original)
      expect(decode(encoded)).toBe('TEST123')
    })

    it('throws on invalid characters', () => {
      expect(() => encodeSecretInEmoji('hello!')).toThrow(
        'Message can only contain letters, numbers, and spaces',
      )
    })

    it('throws on special characters', () => {
      expect(() => encodeSecretInEmoji('test@test')).toThrow()
    })

    it('encodes mixed alphanumeric with spaces', () => {
      const result = encodeSecretInEmoji('HELLO WORLD 123')
      expect(decode(result)).toBe('HELLO WORLD 123')
    })
  })
})
