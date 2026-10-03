// All fixed site copy. Every fact comes from website-handoff/CONTENT.md and
// the proposal. Status words follow the status table in CONTENT.md: the
// game exists, the booth is designed and not built, the programme is
// planned, the grant is requested, the numbers are targets.
// Each section has one heading (from the copy pool) and at most 25 words
// of body text. Display text is set in Kerb Block, which has capitals,
// digits and a few marks only. Sentences are set in Helvetica Neue.

export const SITE = {
  name: 'Kerb Sense',
  tagline: 'Wait, and you get there first.',
  url: 'https://driftsprits-stack.github.io/kerb-sense/',
  repo: 'https://github.com/driftsprits-stack/kerb-sense',
  team: 'TEAM if raeann cared',
  context: 'Delta Challenge 2026, Track B. Young ChangeMakers grant requested.',
  safeLine: 'Stop somewhere safe before you play.',
  year: new Date().getFullYear(),
} as const;

/** The approved Japanese strings (CONTENT.md). Each one carries its English meaning. */
export const JA = {
  name: { text: 'カーブセンス', meaning: 'Kerb Sense' },
  howToCross: { text: '渡り方', meaning: 'How to cross' },
} as const;

/** The reading order. The rail, the menu and the header use it. */
export const SECTIONS = [
  { id: 'problem', number: 1, name: 'PROBLEM' },
  { id: 'booth', number: 2, name: 'BOOTH' },
  { id: 'cross', number: 3, name: 'CROSS' },
  { id: 'plan', number: 4, name: 'PLAN' },
  { id: 'safety', number: 5, name: 'SAFETY' },
  { id: 'budget', number: 6, name: 'BUDGET' },
  { id: 'team', number: 7, name: 'TEAM' },
] as const;

export type SectionId = (typeof SECTIONS)[number]['id'];

export const HERO = {
  body: 'A road-safety game and arcade booth for Singapore students.',
  play: 'PLAY',
  booth: 'BOOTH',
  boothAlt:
    'The Kerb Sense arcade booth design, seen from the front left: a white tabletop cabinet with a black marquee, a screen, four green buttons and a joystick.',
} as const;

export const PROBLEM = {
  body: 'Phones pull eyes off the road at crossings.',
  chart: {
    title: 'Road fatalities in Singapore',
    alt: 'A slope chart. Road fatalities rose from 142 in 2024 to 149 in 2025. Elderly pedestrian fatalities rose from 11 to 27.',
    series: [
      { label: 'ALL ROAD USERS', from: 142, to: 149 },
      { label: 'ELDERLY PEDESTRIANS', from: 11, to: 27 },
    ],
    years: ['2024', '2025'],
  },
  source: 'Source: Singapore Police Force, Annual Road Traffic Situation 2025',
  caveat: 'Not caused by phones or students.',
} as const;

export const BOOTH = {
  statusLabel: 'DESIGNED, TO BE BUILT',
  body: 'A 70 × 65 × 75 cm tabletop arcade students play at school.',
  assembled: 'ASSEMBLED',
  exploded: 'EXPLODED',
  assembledAlt: 'The booth design assembled, seen from the front left.',
  explodedAlt: 'The booth design with its six numbered parts drawn apart.',
  loading: 'LOADING',
  error: 'The 3D booth did not load. These are the flat renders',
  reducedMotion: 'Motion is reduced on this device. These are the flat renders',
  noWebgl: 'This browser cannot show 3D. These are the flat renders',
  canvasLabel: 'A 3D model of the Kerb Sense arcade booth design. Drag to turn it.',
  catalogueLabel: 'PARTS',
  dimensionsAlt: 'Dimension drawing of the booth: 70 cm wide, 65 cm deep, 75 cm tall.',
  /** The three short explanations beside the sticky booth. Each one turns the booth and highlights one part. */
  tour: [
    {
      id: 'screen',
      view: 'front',
      label: 'SCREEN',
      line: 'A 24 inch monitor behind clear glass shows the game.',
    },
    {
      id: 'buttons',
      view: 'top',
      label: 'CONTROLS',
      line: 'Four movement buttons and a joystick. No phone needed.',
    },
    {
      id: 'latches',
      view: 'back',
      label: 'REAR ACCESS',
      line: 'Two hinges and two latches open the back for the computer.',
    },
  ],
  detailEmpty: 'SELECT A PART',
  specs: [
    ['STATUS', 'DESIGNED'],
    ['SIZE', '70 X 65 X 75 CM'],
    ['MATERIAL', '12 MM MDF'],
    ['CONTROLS', 'JOYSTICK + 4 BUTTONS'],
  ],
} as const;

export const CROSS = {
  body: 'Look right, look left, look right again. Then play the game.',
  /** The Singapore crossing order. Six steps, one pictogram each. */
  steps: [
    { id: 'wait', label: 'WAIT', line: 'Stop at the kerb.' },
    { id: 'look-right', label: 'LOOK RIGHT', line: 'Traffic comes from the right first.' },
    { id: 'look-left', label: 'LOOK LEFT', line: 'Then check the other side.' },
    { id: 'look-right-again', label: 'LOOK RIGHT AGAIN', line: 'Check once more before you step off.' },
    { id: 'cross', label: 'CROSS', line: 'Walk, do not run. Keep looking.' },
    { id: 'phone-after', label: 'PHONE AFTER', line: 'Read the message on the other side.' },
  ],
  stepLabel: 'STEP',
  clipAria: 'Play the game. A real gameplay clip of Kerb Sense.',
  play: 'PLAY',
} as const;

export const PLAN = {
  statusLabel: 'PLANNED',
  body: 'Six months in three schools. Nothing is measured yet.',
  months: [
    { month: 1, what: 'Consent, baseline, design lock' },
    { month: 2, what: 'Playtest with 30 students' },
    { month: 3, what: 'Train ambassadors, first school' },
    { month: 4, what: 'Second school' },
    { month: 5, what: 'Third school, interim counts' },
    { month: 6, what: 'Report, toolkit, handover' },
  ],
  targetLabel: 'TARGET',
  targets: [
    { value: 900, label: 'STUDENTS' },
    { value: 1500, label: 'GAME SESSIONS' },
    { value: 20, label: 'AMBASSADORS' },
    { value: 20, label: 'PERCENT LESS PHONE USE, AT LEAST' },
    { value: 20, label: 'POINTS SAFER CROSSING, AT LEAST' },
    { value: 75, label: 'PERCENT RECALL THE SEQUENCE, AT LEAST' },
  ],
  source: 'Source: the Kerb Sense proposal, sections 5 and 6',
} as const;

export const SAFETY = {
  body: 'The website and the game keep nothing. Play happens only in school.',
  items: [
    { id: 'accounts', label: 'NO ACCOUNTS', line: 'No sign-up, no profiles.' },
    { id: 'storage', label: 'NOTHING STORED', line: 'No cookies, no analytics, no data.' },
    {
      id: 'stationary',
      label: 'PLAYED ONLY WHEN STATIONARY',
      line: 'At a booth, with school staff present.',
    },
  ],
} as const;

export const BUDGET = {
  statusLabel: 'REQUESTED',
  body: 'S$3,000 requested. Not awarded yet.',
  total: 'S$3,000 REQUESTED',
  chartAlt:
    'A bar chart of the requested budget: materials and logistics S$1,300, professional costs S$850, marketing S$450, food S$400, venue S$0.',
  lines: [
    { category: 'MATERIALS', amount: 1300 },
    { category: 'PROFESSIONAL', amount: 850 },
    { category: 'MARKETING', amount: 450 },
    { category: 'FOOD', amount: 400 },
    { category: 'VENUE', amount: 0 },
  ],
  source: 'Source: the Kerb Sense proposal, section 9',
} as const;

export const TEAM = {
  body: 'Five students from three institutions in Singapore.',
  members: [
    { name: 'BRENDEN', role: 'PROJECT LEAD' },
    { name: 'JUSTIN', role: 'TECHNICAL LEAD' },
    { name: 'MIN', role: 'DESIGN LEAD' },
    { name: 'WEN WEI', role: 'OPERATIONS LEAD' },
    { name: 'JADEN', role: 'IMPACT AND FINANCE LEAD' },
  ],
} as const;

export const FOOTER = {
  links: [
    { label: 'PRIVACY', href: 'privacy/' },
    { label: 'TERMS', href: 'terms/' },
    { label: 'PLAY', href: 'play/' },
  ],
  source: 'SOURCE',
  backToTop: 'TOP',
  copyright: `© ${SITE.year} Kerb Sense`,
} as const;
