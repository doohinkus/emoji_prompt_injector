import { useState, useMemo } from 'react'
import EMOJI_LIST from './components/EmojiData'
import encodeSecretInEmoji from './utils/emojiEncoder'
import { LLMOptimizedEncoder } from './utils/llmOptimizedEncoder'

// Developer switch to choose which encoder to use
const USE_LLM_OPTIMIZED_ENCODER = true // Set to false to use the original encoder

function App() {
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>('✨')
  const [prompt, setPrompt] = useState<string>('')
  const [copyButtonText, setCopyButtonText] = useState('Copy')
  const [encodingError, setEncodingError] = useState<string | null>(null)

  const injectedPrompt = useMemo(() => {
    setEncodingError(null) // Clear previous errors
    if (!selectedEmoji) {
      return ''
    }
    if (!prompt) {
      return selectedEmoji
    }
    try {
      let encoded: string
      if (USE_LLM_OPTIMIZED_ENCODER) {
        // Use the LLM Optimized Encoder
        // The LLMOptimizedEncoder's 'emoji' config is for internal markers, not the UI selected emoji.
        // We will prepend the selectedEmoji after encoding, similar to the original encoder.
        const llmEncoder = new LLMOptimizedEncoder() // Initialize without emoji config
        const llmEncodedMessage = llmEncoder.encode(prompt)
        encoded = selectedEmoji + llmEncodedMessage // Prepend selectedEmoji
      } else {
        // Use the original encoder
        // Note: encodeSecretInEmoji expects message first, then emoji
        encoded = encodeSecretInEmoji(prompt, selectedEmoji)
      }
      return encoded
    } catch (error: unknown) {
      if (error instanceof Error) {
        setEncodingError(error.message)
      } else {
        setEncodingError('An unknown error occurred during encoding.')
      }
      return selectedEmoji // Fallback to just emoji on error
    }
  }, [selectedEmoji, prompt])

  const handleCopy = () => {
    navigator.clipboard.writeText(injectedPrompt).then(() => {
      setCopyButtonText('Copied!')
      setTimeout(() => setCopyButtonText('Copy'), 2000)
    })
  }

  return (
    <div id="root">
      <header>
        <h1>Emoji Prompt Injector</h1>
        <p>Select an emoji and write your prompt.</p>
      </header>

      <main>
        {/* Emoji Selector */}
        <div className="section-container">
          <h2>1. Select an Emoji</h2>
          <div className="emoji-grid">
            {EMOJI_LIST.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => setSelectedEmoji(emoji)}
                className={`emoji-button ${
                  selectedEmoji === emoji ? 'selected' : ''
                }`}
                aria-label={`Select emoji ${emoji}`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Prompt Input */}
        <div className="section-container">
          <h2>2. Enter Prompt</h2>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your AI prompt here (A-Z, 0-9, space only)..."
            className="textarea-input"
          />
          {encodingError && <p className="error-message">{encodingError}</p>}
        </div>

        {/* Output Display */}
        <div className="section-container">
          <h2>3. Copy Result</h2>
          <div className="copy-button-container">
            <textarea
              readOnly
              value={injectedPrompt}
              className="textarea-input"
              aria-label="Generated prompt"
            />
            <button
              type="button"
              onClick={handleCopy}
              className="copy-button"
              disabled={!injectedPrompt}
            >
              {copyButtonText}
            </button>
          </div>
        </div>
      </main>

      <footer>
        <p>Built according to EMOJI_SPEC.md</p>
      </footer>
    </div>
  )
}

export default App
