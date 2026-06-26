export interface EmojiItem {
  emoji: string
  label: string
}

const EMOJI_LIST: EmojiItem[] = [
  { emoji: '✨', label: 'Sparkles' },
  { emoji: '✅', label: 'Check mark' },
  { emoji: '🚀', label: 'Rocket' },
  { emoji: '💡', label: 'Light bulb' },
  { emoji: '🐛', label: 'Bug' },
  { emoji: '🎉', label: 'Party popper' },
  { emoji: '🔥', label: 'Fire' },
  { emoji: '🐞', label: 'Lady beetle' },
  { emoji: '警告', label: 'Warning' },
  { emoji: '❤️', label: 'Red heart' },
  { emoji: '👍', label: 'Thumbs up' },
  { emoji: '👎', label: 'Thumbs down' },
  { emoji: '😂', label: 'Face with tears of joy' },
  { emoji: '😢', label: 'Crying face' },
  { emoji: '🤔', label: 'Thinking face' },
  { emoji: '🤯', label: 'Exploding head' },
  { emoji: '🙌', label: 'Raising hands' },
  { emoji: '🙏', label: 'Folded hands' },
  { emoji: '👀', label: 'Eyes' },
  { emoji: '👻', label: 'Ghost' },
  { emoji: '👽', label: 'Alien' },
  { emoji: '🤖', label: 'Robot face' },
  { emoji: '👾', label: 'Alien monster' },
  { emoji: '⭐', label: 'Star' },
  { emoji: '🌟', label: 'Glowing star' },
  { emoji: '💫', label: 'Dizzy symbol' },
  { emoji: '💥', label: 'Collision' },
  { emoji: '💯', label: 'Hundred points' },
  { emoji: '💰', label: 'Money bag' },
  { emoji: '📈', label: 'Chart increasing' },
  { emoji: '📉', label: 'Chart decreasing' },
  { emoji: '📌', label: 'Pushpin' },
  { emoji: '📍', label: 'Round pushpin' },
  { emoji: '📎', label: 'Paperclip' },
  { emoji: '🔗', label: 'Link' },
  { emoji: '🔑', label: 'Key' },
  { emoji: '🔒', label: 'Locked' },
  { emoji: '🔓', label: 'Unlocked' },
  { emoji: '🔔', label: 'Bell' },
  { emoji: '📣', label: 'Megaphone' },
]

export default EMOJI_LIST
