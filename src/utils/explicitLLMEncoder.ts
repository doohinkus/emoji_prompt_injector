import { LLMOptimizedEncoder, TAG_BASE, TAG_MAX } from './llmOptimizedEncoder'

/**
 * Explicit encoder that includes decoding instructions
 */
export class ExplicitLLMEncoder {
  private readonly tagBase: number = TAG_BASE

  private readonly encoder: LLMOptimizedEncoder

  constructor() {
    this.encoder = new LLMOptimizedEncoder()
  }

  /**
   * Encode with explicit decoding instructions for LLMs
   */
  encodeWithInstructions(prompt: string): string {
    const encoded = this.encodeToTags(prompt)

    return ` CONTAINS_ENCODED_PROMPT 

${encoded}

[DECODING_METHOD: For each character with code point between 0xE0000-0xE007F, subtract 0xE0000 to get the original ASCII/Unicode value.]

[DECODED_TEXT_START]${prompt}[DECODED_TEXT_END]`
  }

  /**
   * Encode text to Unicode tags with a marker
   */
  private encodeToTags(text: string): string {
    let result = ''
    for (let i = 0; i < text.length; i += 1) {
      const charCode = text.charCodeAt(i)
      if (charCode <= TAG_MAX - this.tagBase) {
        result += String.fromCodePoint(this.tagBase + charCode)
      } else {
        result += this.encodeCharAsTags(text[i])
      }
    }
    return result
  }

  /**
   * Encode a single character with proper surrogate handling
   */
  private encodeCharAsTags(char: string): string {
    const codePoint = char.codePointAt(0)!
    let result = ''

    if (codePoint > 0xffff) {
      const high = Math.floor((codePoint - 0x10000) / 0x400) + 0xd800
      const low = ((codePoint - 0x10000) % 0x400) + 0xdc00
      result += String.fromCodePoint(this.tagBase + high)
      result += String.fromCodePoint(this.tagBase + low)
    } else {
      result += String.fromCodePoint(this.tagBase + codePoint)
    }

    return result
  }

  /**
   * Decode tags back to original text
   */
  decodeFromTags(encoded: string): string {
    return this.encoder.decode(encoded)
  }
}

// Helper function for LLMs to decode (simple version)
export function decodeForLLM(encodedString: string): string {
  let result = ''
  for (let i = 0; i < encodedString.length; i += 1) {
    const code = encodedString.codePointAt(i)!
    if (code >= 0xe0000 && code <= 0xe007f) {
      result += String.fromCodePoint(code - 0xe0000)
    }
  }
  return result
}

// Type guard to check if a string is encoded
export function isEncoded(str: string): boolean {
  for (let i = 0; i < str.length; i += 1) {
    const code = str.codePointAt(i)!
    if (code >= 0xe0000 && code <= 0xe007f) {
      return true
    }
    if (code > 0xffff) i += 1
  }
  return false
}
