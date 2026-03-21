/**
 * Encodes a secret message into an emoji using Unicode tag characters
 * @param {string} message - The secret message to encode (A-Z, 0-9, space only)
 * @param {string} emoji - The emoji to hide the message behind (default: '')
 * @returns {string} - Emoji with hidden encoded message
 */
export default function encodeSecretInEmoji(
  message: string,
  emoji: string = '',
): string {
  // Validate message contains only allowed characters
  const allowedChars = /^[A-Z0-9\s]+$/i
  if (!allowedChars.test(message)) {
    throw new Error('Message can only contain letters, numbers, and spaces')
  }

  // Convert message to uppercase for consistency
  const upperMessage = message.toUpperCase()

  // Map characters to Unicode tag characters
  // Tag characters start at U+E0000, with 'a' at U+E0041
  const encoded = Array.from(upperMessage)
    .map((char) => {
      if (char === ' ') {
        // Space maps to U+E0020 (tag space)
        return String.fromCodePoint(0xe0020)
      }

      // Get ASCII code and convert to tag character
      // 'A' (65) -> U+E0041, 'B' (66) -> U+E0042, etc.
      const ascii = char.charCodeAt(0)
      if (ascii >= 65 && ascii <= 90) {
        // A-Z
        return String.fromCodePoint(0xe0000 + ascii)
      }
      if (ascii >= 48 && ascii <= 57) {
        // 0-9
        return String.fromCodePoint(0xe0000 + ascii)
      }
      return char // Should never reach here due to validation
    })
    .join('')

  // Return emoji + encoded message
  return emoji + encoded
}
