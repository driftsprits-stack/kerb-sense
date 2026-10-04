import TOKENS from '../lib/tokens.json';

// A section marker (website shortlist pick 23): a small shape on a 24 unit
// grid, always next to the section's word, so it never stands for anything on
// its own. Decorative, so hidden from assistive technology.
export type TokenName = keyof typeof TOKENS;

export default function Token({ name, className = '' }: { name: TokenName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path d={TOKENS[name]} fill="currentColor" fillRule="evenodd" />
    </svg>
  );
}
