// All fixed site copy. Every fact comes from website-handoff/CONTENT.md and
// the proposal. Status words follow the status table in CONTENT.md: the
// game exists, the booth is designed and not built, the programme is
// planned, the grant is requested, the numbers are targets.
// Only the hero headline and the section titles (src/copy.ts) end with a
// decorative full stop. Buttons, labels, names and captions do not.

export const SITE = {
  name: 'Kerb Sense',
  tagline: 'Wait, and you get there first.',
  oneLiner:
    'A free browser game and six-month schools programme where the safest way to cross is also the best way to score.',
  url: 'https://driftsprits-stack.github.io/kerb-sense/',
  repo: 'https://github.com/driftsprits-stack/kerb-sense',
  team: 'TEAM if raeann cared',
  context:
    'Delta Challenge 2026, Track B, Road Safety Education. Organised by the Singapore Police Force and the National Crime Prevention Council, with the National Youth Council Young ChangeMakers grant (funding requested).',
  safeLine: 'Stop somewhere safe before you play.',
  year: new Date().getFullYear(),
} as const;

/** The approved Japanese strings (CONTENT.md). Each one carries its English meaning. */
export const JA = {
  name: { text: 'カーブセンス', meaning: 'Kerb Sense' },
  tagline: { text: '待てば、先に着く。', meaning: 'Wait, and you get there first.' },
  howToCross: { text: '渡り方', meaning: 'How to cross' },
  play: { text: 'あそぶ', meaning: 'Play' },
} as const;

/** The reading order. The index, the header and the "Next" links use it. */
export const SECTIONS = [
  { id: 'problem', number: 1, name: 'The problem', next: 'Next: our answer' },
  { id: 'answer', number: 2, name: 'Our answer', next: 'Next: explore the booth' },
  { id: 'booth', number: 3, name: 'The booth', next: 'Next: play the game' },
  { id: 'game', number: 4, name: 'The game', next: 'Next: the six-month plan' },
  { id: 'plan', number: 5, name: 'The plan', next: 'Next: how we will measure it' },
  { id: 'measure', number: 6, name: 'How we will measure it', next: 'Next: safety and privacy' },
  { id: 'safety', number: 7, name: 'Safe by design', next: 'Next: the team' },
  { id: 'team', number: 8, name: 'The team', next: 'Next: the budget' },
  { id: 'budget', number: 9, name: 'The budget', next: 'Back to top' },
] as const;

export type SectionId = (typeof SECTIONS)[number]['id'];

export const HERO = {
  kicker: 'A road-safety game and a planned arcade booth for primary and secondary students in Singapore',
  body: SITE.oneLiner,
  who: 'For students. Judged by the people who keep them safe.',
  play: 'Play the game',
  booth: 'See the booth',
  title: 'KERB SENSE',
  boothAlt:
    'The Kerb Sense arcade booth design: a white tabletop cabinet with a black marquee, a screen, four green buttons and a joystick.',
} as const;

export const PROBLEM = {
  summary: 'Students use phones while they cross. A phone takes attention from the road.',
  body: [
    'The Delta Challenge 2026 Track B brief names phone distraction among pedestrians, particularly students, as the problem. Near misses and accidents become more likely when attention is on a screen.',
    'Most students know the rules. Knowing a rule is not the same as following it. Students need to practise decisions, not only hear them. Kerb Sense starts with primary and secondary school students, before unsafe habits form.',
  ],
  stat: { value: '142 to 149', label: 'road fatalities in Singapore, 2024 to 2025' },
  stat2: { value: '11 to 27', label: 'elderly pedestrian fatalities, 2024 to 2025' },
  source: 'Source: Singapore Police Force, Annual Road Traffic Situation 2025',
  caveat:
    'These figures are not caused by phone use or by students. They show why road-safety education still matters.',
} as const;

export const ANSWER = {
  summary: 'A game you can play now, a booth we will build, and a programme we plan to run.',
  columns: [
    {
      id: 'game',
      status: 'Exists',
      title: 'The game',
      body: 'A free browser game. It is live and playable now. Safe decisions score.',
      link: 'Play the game',
      href: 'play/',
    },
    {
      id: 'booth',
      status: 'Designed',
      title: 'The booth',
      body: 'A portable tabletop arcade cabinet, designed by the team. We will build three in the funded period.',
      link: 'Explore the booth',
      href: '#booth',
    },
    {
      id: 'programme',
      status: 'Planned',
      title: 'The programme',
      body: 'Six months in three participating schools, with student ambassadors and anonymous observation.',
      link: 'See the plan',
      href: '#plan',
    },
  ],
} as const;

export const BOOTH = {
  summary:
    'A portable arcade booth, designed by the team, to be built. Students play without taking out a phone.',
  statusLabel: 'Designed, to be built',
  viewerTitle: 'Explore the booth',
  viewerHint: 'Drag to turn it. Select a part to see what it does.',
  explode: 'Explode',
  assemble: 'Assemble',
  loading: 'Loading the booth',
  error: 'The 3D booth did not load. These are the flat renders',
  reducedMotion: 'Motion is reduced on this device. These are the flat renders',
  noWebgl: 'This browser cannot show 3D. These are the flat renders',
  canvasLabel: 'A 3D model of the Kerb Sense arcade booth design. Drag to turn it.',
  catalogueTitle: 'The parts',
  catalogueHint: 'Select a part here to highlight it on the model.',
  specTitle: 'The design',
  specs: [
    ['Status', 'A finished 3D design. Not built yet. The cabinets are built in the funded period.'],
    ['Width', '61.7 cm'],
    ['Depth', '71.2 cm'],
    ['Height', '66.8 cm'],
    ['Material', '12 mm MDF or plywood, cut to size'],
    ['Screen', '24 inch monitor opening'],
    ['Controls', 'Four movement buttons and a joystick with a built-in button'],
    ['Access', 'Rear panel with two hinges and two latches'],
    ['Finish', 'Rounded edges and ventilation slots'],
    ['Stations', 'Three planned, one per school, plus one backup bundle'],
    ['Computer', 'Team-owned. The grant would fund only the controls, connections and cabinet materials'],
  ],
  where: 'The booth is for safe, stationary areas inside schools',
} as const;

export const GAME = {
  summary:
    'The game is live. You cross Singapore-inspired roads while your phone competes for your attention.',
  statusLabel: 'Live now',
  clipLabel: 'PLAY',
  clipCaption: 'Real gameplay on the Teenager profile. Select it to play the game',
  clipAria: 'Play the game. A real gameplay clip of Kerb Sense.',
  pledge: 'I solemnly swear not to check my phone while crossing.',
  pledgeButton: 'I promise',
  pledgeNote: 'The game opens with this pledge. You see it again in the debrief.',
  rulesTitle: 'The rules',
  rules: [
    { title: 'You only see where you look', body: 'A vision cone follows your aim.' },
    { title: 'Green means cars are braking, not that the road is clear', body: 'Some drivers run the red.' },
    { title: 'Cross between the dashed lines', body: 'Crossing there on green pushes the wall back.' },
    {
      title: 'The warning triangle means do not cross yet',
      body: 'A speeding car is coming and it sounds its horn.',
    },
    { title: 'Your message can wait', body: 'Notifications queue. Answer them back on the pavement.' },
    { title: 'Keep moving', body: 'A wall chases you. Waiting at a red signal pauses it.' },
    { title: 'Earphones are a real distraction', body: 'While music plays you cannot hear the horn.' },
    {
      title: 'Failure is never graphic',
      body: 'Every failed run names the unsafe decision and the real-world habit that would have prevented it.',
    },
  ],
  profilesTitle: 'Three profiles',
  profiles: [
    { id: 'primary', name: 'Primary School', body: 'Music on. You will not hear them coming.' },
    { id: 'teenager', name: 'Teenager', body: 'Music, plus phone notifications that will not stop.' },
    { id: 'office', name: 'Office Worker', body: 'Music, the boss, and a full cup of kopi.' },
  ],
  /** The WIRE-style running order. The word is white, the bracket is green. */
  runningOrder: [
    { word: 'WAIT', bracket: '[KERB]:' },
    { word: 'LOOK', bracket: '[BOTH WAYS]:' },
    { word: 'LISTEN', bracket: '[TRAFFIC]:' },
    { word: 'CROSS', bracket: '[GREEN MAN]:' },
    { word: 'PHONE', bracket: '[AFTER]:' },
  ],
  play: 'Play the game',
  controls: 'Arrow keys or WASD move. Space answers a message. Escape pauses.',
} as const;

export const ROAD_BAND = ['LOOK', 'LISTEN', 'CROSS', 'THEN CHECK'] as const;

export const PLAN = {
  summary: 'We plan six months in three participating schools.',
  statusLabel: 'Planned',
  note: 'The schools are not confirmed yet. The proposal calls them School A, B and C.',
  months: [
    {
      month: 1,
      activities:
        'We will get permissions, run matched baseline observations and student interviews, complete school and parental consent, and lock the final design.',
      outputs: 'Confirmed sites, a baseline dataset and an observation protocol',
    },
    {
      month: 2,
      activities:
        'We will refine the prototype, do accessibility work, and playtest with at least 30 students.',
      outputs: 'A pilot-ready game, a playtest report and a safety checklist',
    },
    {
      month: 3,
      activities: 'We will train ambassadors and launch the first school.',
      outputs: 'The first school live, and the first session dataset',
    },
    {
      month: 4,
      activities: 'We will refine the game, launch the second school and continue the first.',
      outputs: 'The second school live, and an interim improvement log',
    },
    {
      month: 5,
      activities: 'We will launch the third school and run interim observations at the earlier schools.',
      outputs: 'Three schools live, and an interim observation dataset',
    },
    {
      month: 6,
      activities:
        'We will write the impact report, publish the open toolkit and hand over to the three schools.',
      outputs: 'The impact report, the open toolkit and the handover',
    },
  ],
} as const;

export const MEASURE = {
  summary: 'Six targets. Nothing is measured yet.',
  badge: 'Target',
  items: [
    { value: 900, prefix: '', suffix: '', label: 'student participants' },
    { value: 1500, prefix: '', suffix: '', label: 'game sessions' },
    { value: 20, prefix: '', suffix: '', label: 'student ambassadors trained' },
    {
      value: 20,
      prefix: 'At least',
      suffix: '%',
      label: 'relative reduction in visible phone use while crossing at the pilot sites',
    },
    {
      value: 20,
      prefix: 'At least',
      suffix: 'pt',
      label: 'percentage-point improvement in safe-crossing rate, first run against coached replay',
    },
    {
      value: 75,
      prefix: 'At least',
      suffix: '%',
      label: 'of exit respondents recall the correct phone-check sequence',
    },
  ],
  how: 'How we will measure it: observers will count visible phone use while crossing with anonymous tallies at each site, at baseline and at the end. The game will compare each player’s first run with their coached replay inside one session, with no identifier. A one-minute exit question will check whether players can state the sequence: finish crossing, use the marked crossing, wait for the signal.',
  source: 'Source: the Kerb Sense proposal, section 6',
} as const;

export const SAFETY = {
  summary: 'The game teaches safe crossing. Nothing here may encourage phone use near a road.',
  big: SITE.safeLine,
  website: {
    title: 'This website',
    body: 'Collects nothing. No cookies, no analytics, no forms and no third-party scripts.',
  },
  game: {
    title: 'The live game',
    body: 'Stores nothing. We checked the game code on 2 October 2026: no localStorage, sessionStorage, IndexedDB, cookies or network requests.',
  },
  programme: {
    title: 'The planned school programme',
    body: 'At the booths, the team plans to count anonymous, aggregate session numbers, with no accounts and no personal profiles, plus anonymous observation tallies at crossings. This has not started.',
  },
  items: [
    {
      title: 'Failure is never graphic',
      body: 'No collision is shown. A failed run cuts to a results screen that explains the decision.',
    },
    {
      title: 'Play only when stationary',
      body: 'Play would happen only in stationary school locations, with school staff present, after the school parental consent process.',
    },
    {
      title: 'Observation stays anonymous',
      body: 'Observers would use anonymous tallies only. No photos, names or identifying details.',
    },
    {
      title: 'Sound and motion controls',
      body: 'The game supports reduced motion and keyboard navigation. Sound can be muted.',
    },
    {
      title: 'Students under 18',
      body: 'All sessions would be arranged through the school and run with a member of school staff present.',
    },
  ],
} as const;

export const TEAM = {
  summary: `${SITE.team}: five students from three institutions in Singapore.`,
  members: [
    { role: 'Project Lead', name: 'Brenden', institution: 'Singapore Polytechnic' },
    { role: 'Technical Lead', name: 'Justin', institution: 'Ngee Ann Polytechnic' },
    { role: 'Design Lead', name: 'Min', institution: 'Yishun Innova Junior College' },
    { role: 'Operations Lead', name: 'Wen Wei', institution: 'Singapore Polytechnic' },
    { role: 'Impact and Finance Lead', name: 'Jaden', institution: 'Singapore Polytechnic' },
  ],
} as const;

export const BUDGET = {
  summary: 'S$3,000 requested. Not awarded yet.',
  statusLabel: 'Requested',
  lines: [
    { category: 'Venue', amount: 0 },
    { category: 'Marketing and publicity', amount: 450 },
    { category: 'Food and beverages', amount: 400 },
    { category: 'Project materials and logistics', amount: 1300 },
    { category: 'Professional costs (illustration, sound, translation)', amount: 850 },
  ],
  topTitle: 'Top items',
  top: [
    'Three DIY cabinets, S$360',
    'Four USB arcade control kits, S$140',
    'A backup display and computer bundle, S$250',
    'Original illustration and sound design, S$700',
  ],
  note: 'No grant money would go to cash prizes or to team members.',
  source: 'Source: the Kerb Sense proposal, section 9',
} as const;

export const FOOTER = {
  context: SITE.context,
  referencesTitle: 'References',
  references: [
    'Singapore Police Force and National Crime Prevention Council (2026). Delta Challenge 2026 Track B: Road Safety Education briefing, 1 August 2026.',
    'Singapore Police Force and National Crime Prevention Council (2026). Rules and Regulations for Delta Challenge 2026 Track B: Problem-Based Statement Challenge.',
    'Singapore Police Force (2026). Annual Road Traffic Situation 2025.',
    'Duperrex, O., Roberts, I. and Bunn, F. (2002). Safety education of pedestrians for injury prevention. Cochrane Database of Systematic Reviews, CD001531.',
    'Riaz, M.S., Cuenen, A., Janssens, D., Brijs, K. and Wets, G. (2019). Evaluation of a gamified e-learning platform to improve traffic safety among elementary school pupils in Belgium. Personal and Ubiquitous Computing, 23(5-6), 931-941.',
  ],
  referenceLinks: {
    spf: 'https://www.police.gov.sg/-/media/SPF/Media-Room/Statistics/Annual-Road-Traffic-Situation-2025/Annual-Road-Traffic-Situation-2025.pdf',
    riaz: 'https://doi.org/10.1007/s00779-019-01221-4',
  },
  links: [
    { href: 'privacy/', label: 'Privacy and cookies' },
    { href: 'terms/', label: 'Terms of use' },
    { href: 'play/', label: 'Play' },
  ],
  source: 'Source code on GitHub',
  backToTop: 'Back to top',
  copyright: `© ${SITE.year} Kerb Sense`,
} as const;
