const ADJECTIVES = [
  "silent", "urban", "civic", "brave", "keen", "swift",
  "calm", "bold", "clear", "fair",
];

const NOUNS = [
  "observer", "voice", "eye", "watch", "signal", "beacon",
  "witness", "lens", "scout", "herald",
];

export function generateUsername(): string {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const num = Math.floor(Math.random() * 10000);
  return `${adj}-${noun}-${num}`;
}
