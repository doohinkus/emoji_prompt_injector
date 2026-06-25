# Emoji Prompt Injector

Invisibly encode AI prompts inside emojis using Unicode steganography.

## What It Does

This tool lets you hide a text prompt inside an emoji using invisible Unicode **tag characters** (U+E0000–U+E007F). To a human, only the emoji is visible. To an AI/LLM, the hidden text is readable by decoding the tag characters.

## How It Works

Each character in your prompt is converted to a Unicode tag character by adding `0xE0000` to its code point. These tag characters are invisible/zero-width in most renderers, so they appear hidden behind a visible emoji. An LLM can recover the original text by subtracting `0xE0000` from each tag character's code point.

## Getting Started

```bash
npm install
npm run dev      # Start development server
npm run build    # Production build
npm run preview  # Preview production build
```

## Step-by-Step Usage

### Step 1: Select an Emoji
Click any emoji in the grid (e.g., `🚀`, `✨`, `✅`). The selected emoji is highlighted in cyan.

### Step 2: Enter Your Prompt
Type your prompt in the text area. Only **letters (A–Z)**, **digits (0–9)**, and **spaces** are allowed. Other characters will cause an error.

### Step 3: Copy the Encoded Result
The output area shows your selected emoji followed by invisible tag characters. Click **Copy** to copy the encoded string to your clipboard. Use this anywhere — paste it into ChatGPT, Claude, an API call, etc.

> **Tip:** The encoded string looks like just a single emoji, but the hidden text travels with it.

## For AI / LLM Users

To decode the hidden message programmatically, iterate over the code points of the string and subtract `0xE0000` from any character in the range `U+E0000–U+E007F`:

```ts
const TAG_BASE = 0xe0000
const TAG_MAX = 0xe007f

function decode(encoded: string): string {
  let result = ''
  for (const char of encoded) {
    const code = char.codePointAt(0)!
    if (code >= TAG_BASE && code <= TAG_MAX) {
      result += String.fromCodePoint(code - TAG_BASE)
    }
  }
  return result
}
```

The LLM Optimized Encoder (`src/utils/llmOptimizedEncoder.ts`) also includes built-in `decode()` and `extractAllEncoded()` methods.

## Technical Detail

| Component | Range |
|---|---|
| Tag character base | `U+E0000` |
| Tag character max | `U+E007F` |
| Encodable range per char | `U+0000` to `U+007F` (basic ASCII) |
| Supported input | A–Z, 0–9, space (original encoder); broader ASCII (LLM encoder) |

The app ships with two encoders:
- **Original encoder** (`emojiEncoder.ts`) — strict A–Z, 0–9, space only
- **LLM Optimized encoder** (`llmOptimizedEncoder.ts`) — broader ASCII support, batch encoding, decode methods, and prompt patterns

Toggle between them via `USE_LLM_OPTIMIZED_ENCODER` in `src/App.tsx`.

## Tech Stack

- **React 18** with TypeScript
- **Vite** for build tooling
- Plain CSS (dark theme)
- ESLint + Prettier (Airbnb style)

## License

Private — built for AI developer tooling.
