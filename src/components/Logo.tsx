// The wordmark and the "k." monogram from website-handoff/assets/logo/.
// The files are used as they are (DESIGN.md section 4: do not redraw them).
import wordmarkBlack from '../assets/logo/kerbsense-wordmark-black.svg';
import wordmarkWhite from '../assets/logo/kerbsense-wordmark-white.svg';
import wordmarkOnGreen from '../assets/logo/kerbsense-wordmark-on-green.svg';
import markBlack from '../assets/logo/kerbsense-mark-black.svg';
import markOnBlack from '../assets/logo/kerbsense-mark-on-black.svg';
import markOnGreen from '../assets/logo/kerbsense-mark-on-green.svg';

type Variant = 'black' | 'white' | 'on-green';

const WORDMARK: Record<Variant, string> = {
  black: wordmarkBlack,
  white: wordmarkWhite,
  'on-green': wordmarkOnGreen,
};
const MARK: Record<Variant, string> = {
  black: markBlack,
  white: markOnBlack,
  'on-green': markOnGreen,
};

// The wordmark SVG is 5689 x 1005 units.
const RATIO = 5689 / 1005;

export default function Logo({
  variant = 'black',
  height = 24,
  lazy = false,
}: {
  variant?: Variant;
  height?: number;
  lazy?: boolean;
}) {
  return (
    <img
      src={WORDMARK[variant]}
      alt="Kerb Sense"
      width={Math.round(height * RATIO)}
      height={height}
      style={{ height, width: 'auto' }}
      decoding="async"
      loading={lazy ? 'lazy' : undefined}
    />
  );
}

export function Mark({ variant = 'on-green', size = 32 }: { variant?: Variant; size?: number }) {
  return <img src={MARK[variant]} alt="" width={size} height={size} decoding="async" aria-hidden="true" />;
}
