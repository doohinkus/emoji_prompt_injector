import { useState, useMemo, useCallback, useRef } from 'react'
import EMOJI_LIST, { type EmojiItem } from './components/EmojiData'
import encodeSecretInEmoji from './utils/emojiEncoder'
import { LLMOptimizedEncoder } from './utils/llmOptimizedEncoder'

const USE_LLM_OPTIMIZED_ENCODER = true

function getInitialFocusIndex(): number {
  return EMOJI_LIST.findIndex((item) => item.emoji === '✨')
}

function App() {
  const [selectedEmoji, setSelectedEmoji] = useState<string>('✨')
  const [focusableIndex, setFocusableIndex] =
    useState<number>(getInitialFocusIndex)
  const [prompt, setPrompt] = useState<string>('')
  const [copyButtonText, setCopyButtonText] = useState('Copy')
  const [encodingError, setEncodingError] = useState<string | null>(null)
  const emojiRefs = useRef<(HTMLButtonElement | null)[]>([])

  const injectedPrompt = useMemo(() => {
    setEncodingError(null)
    if (!selectedEmoji) {
      return ''
    }
    if (!prompt) {
      return selectedEmoji
    }
    try {
      let encoded: string
      if (USE_LLM_OPTIMIZED_ENCODER) {
        const llmEncoder = new LLMOptimizedEncoder()
        const llmEncodedMessage = llmEncoder.encode(prompt)
        encoded = selectedEmoji + llmEncodedMessage
      } else {
        encoded = encodeSecretInEmoji(prompt, selectedEmoji)
      }
      return encoded
    } catch (error: unknown) {
      if (error instanceof Error) {
        setEncodingError(error.message)
      } else {
        setEncodingError('An unknown error occurred during encoding.')
      }
      return selectedEmoji
    }
  }, [selectedEmoji, prompt])

  const handleCopy = () => {
    navigator.clipboard.writeText(injectedPrompt).then(() => {
      setCopyButtonText('Copied!')
      setTimeout(() => setCopyButtonText('Copy'), 2000)
    })
  }

  const handleEmojiKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      let newIndex = index
      const cols = 6

      switch (e.key) {
        case 'ArrowRight':
          newIndex = (index + 1) % EMOJI_LIST.length
          break
        case 'ArrowLeft':
          newIndex = (index - 1 + EMOJI_LIST.length) % EMOJI_LIST.length
          break
        case 'ArrowDown':
          newIndex = Math.min(index + cols, EMOJI_LIST.length - 1)
          break
        case 'ArrowUp':
          newIndex = Math.max(index - cols, 0)
          break
        case 'Home':
          newIndex = 0
          break
        case 'End':
          newIndex = EMOJI_LIST.length - 1
          break
        default:
          return
      }

      e.preventDefault()
      setFocusableIndex(newIndex)
      emojiRefs.current[newIndex]?.focus()
    },
    [],
  )

  const handleEmojiClick = useCallback((emoji: string, index: number) => {
    setSelectedEmoji(emoji)
    setFocusableIndex(index)
  }, [])

  const setEmojiRef = useCallback(
    (index: number) => (el: HTMLButtonElement | null) => {
      emojiRefs.current[index] = el
    },
    [],
  )

  return (
    <div id="root">
      <header>
        <h1>Emoji Prompt Injector</h1>
        <p>Select an emoji and write your prompt.</p>
      </header>

      <main>
        <div className="section-container">
          <h2 id="emoji-grid-label">1. Select an Emoji</h2>
          <div
            className="emoji-grid"
            role="listbox"
            aria-labelledby="emoji-grid-label"
          >
            {EMOJI_LIST.map((item: EmojiItem, index: number) => (
              <button
                key={item.emoji}
                type="button"
                ref={setEmojiRef(index)}
                tabIndex={index === focusableIndex ? 0 : -1}
                onClick={() => handleEmojiClick(item.emoji, index)}
                onKeyDown={(e) => handleEmojiKeyDown(e, index)}
                className={`emoji-button ${
                  selectedEmoji === item.emoji ? 'selected' : ''
                }`}
                role="option"
                aria-selected={selectedEmoji === item.emoji}
                aria-label={item.label}
              >
                {item.emoji}
              </button>
            ))}
          </div>
        </div>

        <div className="section-container">
          <h2>2. Enter Prompt</h2>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your AI prompt here (A-Z, 0-9, space only)..."
            className="textarea-input"
            aria-label="Enter prompt"
          />
          {encodingError && <p className="error-message">{encodingError}</p>}
        </div>

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
