/**
 * Unicode tag character range for invisible encoding
 * U+E0000 to U+E007F (95 characters available)
 */
export const TAG_BASE = 0xe0000
export const TAG_MAX = 0xe007f

/**
 * Marker emojis for different prompt types
 */
type PromptMarker = '' | '' | '' | '' | '⚙️' | ''

/**
 * Configuration for the encoder
 */
interface EncoderConfig {
  emoji?: PromptMarker
  includeDecodingHint?: boolean
  hintPosition?: 'prefix' | 'suffix'
}

/**
 * Pattern for prompts with metadata
 */
interface PromptPattern {
  system: string
  user: string
  instruction: string
}

/**
 * LLM-Optimized Encoder for embedding prompts in invisible Unicode tags
 * Makes prompts easily readable by LLMs while remaining invisible to humans
 */
export class LLMOptimizedEncoder {
  private readonly emoji: PromptMarker

  private readonly tagBase: number = TAG_BASE

  private readonly markers: PromptMarker[] = ['', '', '', '', '⚙️']

  constructor(config: EncoderConfig = {}) {
    this.emoji = config.emoji || ''
  }

  /**
   * Encode a message into Unicode tag characters
   * @param message - The message to encode
   * @returns Encoded string with emoji prefix
   */
  encode(message: string): string {
    let result = this.emoji

    for (let i = 0; i < message.length; i += 1) {
      const charCode = message.charCodeAt(i)
      // Ensure charCode is within valid range for tags
      if (charCode <= TAG_MAX - TAG_BASE) {
        result += String.fromCodePoint(this.tagBase + charCode)
      } else {
        // Handle characters outside the tag range by splitting into surrogates
        result += this.encodeCharAsTags(message[i])
      }
    }

    return result
  }

  /**
   * Encode a single character that may require multiple code points
   */
  private encodeCharAsTags(char: string): string {
    const codePoint = char.codePointAt(0)!
    let result = ''

    // Convert to UTF-16 surrogate pair representation
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
   * Decode Unicode tag characters back to original message
   * @param encoded - The encoded string
   * @returns Decoded message
   */
  decode(encoded: string): string {
    let result = ''

    for (let i = 0; i < encoded.length; i += 1) {
      const codePoint = encoded.codePointAt(i)!

      if (codePoint >= this.tagBase && codePoint <= TAG_MAX) {
        const originalCode = codePoint - this.tagBase

        // Handle surrogate pairs
        if (originalCode >= 0xd800 && originalCode <= 0xdbff) {
          // High surrogate - look ahead for low surrogate
          const nextCodePoint = encoded.codePointAt(i + 1)
          if (
            nextCodePoint &&
            nextCodePoint >= this.tagBase &&
            nextCodePoint <= TAG_MAX
          ) {
            const nextOriginal = nextCodePoint - this.tagBase
            if (nextOriginal >= 0xdc00 && nextOriginal <= 0xdfff) {
              const combined =
                (originalCode - 0xd800) * 0x400 +
                (nextOriginal - 0xdc00) +
                0x10000
              result += String.fromCodePoint(combined)
              i += 1 // Skip the next tag
              // Removed continue
            }
          }
        } else {
          // Added else for refactored continue
          result += String.fromCodePoint(originalCode)
        }

        // Skip over multi-code-point characters
        if (codePoint > 0xffff) i += 1
      } else {
        // Added else for refactored continue
        // If not a tag character, just append it
        result += String.fromCodePoint(codePoint)
      }
    }

    return result
  }

  /**
   * Encode with a visual hint for LLMs
   */
  encodeWithHint(message: string, hint: string = '[HIDDEN_MESSAGE]'): string {
    return `${this.encode(message)} ${hint}`
  }

  /**
   * Encode multiple prompts with different markers
   */
  encodeBatch(prompts: string[]): string[] {
    return prompts.map((prompt, index) => {
      const marker = this.getMarker(index)
      return marker + this.encode(prompt)
    })
  }

  /**
   * Get a marker emoji by index
   */
  private getMarker(index: number): PromptMarker {
    return this.markers[index % this.markers.length]
  }

  /**
   * Create a structured pattern with system prompt encoded
   */
  createPromptPattern(systemPrompt: string, userPrompt: string): PromptPattern {
    return {
      system: this.encode(systemPrompt),
      user: userPrompt,
      instruction:
        'The emoji contains encoded text. Look for Unicode tag characters (U+E0000 range) and decode them by subtracting 0xE0000 from each code point.',
    }
  }

  /**
   * Check if a string contains encoded content
   */
  containsEncodedContent(str: string): boolean {
    for (let i = 0; i < str.length; i += 1) {
      const codePoint = str.codePointAt(i)!
      if (codePoint >= this.tagBase && codePoint <= TAG_MAX) {
        return true
      }
      if (codePoint > 0xffff) i += 1
    }
    return false
  }

  /**
   * Extract all encoded messages from a string
   */
  extractAllEncoded(str: string): string[] {
    const messages: string[] = []
    let currentMessage = ''
    let insideEncoded = false

    for (let i = 0; i < str.length; i += 1) {
      const codePoint = str.codePointAt(i)!

      if (codePoint >= this.tagBase && codePoint <= TAG_MAX) {
        if (!insideEncoded) {
          insideEncoded = true
          currentMessage = ''
        }
        const originalCode = codePoint - this.tagBase
        currentMessage += String.fromCodePoint(originalCode)
        if (codePoint > 0xffff) i += 1
      } else if (insideEncoded && currentMessage.length > 0) {
        messages.push(currentMessage)
        insideEncoded = false
        currentMessage = ''
      }
    }

    // Add the last message if any
    if (insideEncoded && currentMessage.length > 0) {
      messages.push(currentMessage)
    }

    return messages
  }
}
