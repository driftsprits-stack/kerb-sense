// All site copy. Every fact comes from website-handoff/CONTENT.md and the
// proposal. Headlines end with a full stop (Ahoy). No em dashes, no emoji.

export const SITE = {
  name: 'Kerb Sense',
  tagline: 'Wait, and you get there first.',
  oneLiner:
    'A free browser game and six-month schools programme where the safest way to cross is also the best way to score.',
  url: 'https://driftsprits-stack.github.io/kerb-sense/',
  repo: 'https://github.com/driftsprits-stack/kerb-sense',
  team: 'TEAM if raeann cared',
  context:
    'Delta Challenge 2026, Track B, Road Safety Education. Organised by the Singapore Police Force and the National Crime Prevention Council, with the National Youth Council Young ChangeMakers grant.',
  safeLine: 'Stop somewhere safe before you play.',
  year: new Date().getFullYear(),
} as const;

export const NAV = [
  { id: 'problem', label: 'problem' },
  { id: 'game', label: 'game' },
  { id: 'booth', label: 'booth' },
  { id: 'programme', label: 'programme' },
  { id: 'targets', label: 'targets' },
  { id: 'safety', label: 'safety' },
  { id: 'team', label: 'team' },
  { id: 'budget', label: 'budget' },
] as const;

export const HERO = {
  kicker: 'A road-safety game and arcade booth for students in Singapore.',
  headline: 'Wait, and you get there first.',
  body: SITE.oneLiner,
  play: 'Play the game.',
  booth: 'See the booth.',
  clipLabel: 'Play.',
  clipCaption: 'Real gameplay on the Teenager profile. Click to play the game.',
} as const;

export const PROBLEM = {
  headline: 'The problem.',
  lead: 'Students use phones while they walk and cross. A phone takes attention from the road. Near misses and accidents become more likely.',
  columns: [
    {
      title: 'The brief.',
      body: 'The Delta Challenge 2026 Track B brief names phone distraction among pedestrians, particularly students, as the problem to solve.',
    },
    {
      title: 'Start earlier.',
      body: 'Kerb Sense works with primary and secondary school students, before unsafe habits form.',
    },
    {
      title: 'Practise, not posters.',
      body: 'Most students know the rules. Knowing a rule is not the same as following it. Students need to practise decisions, not only hear them.',
    },
  ],
  stats: [
    { value: '142 to 149', label: 'Road fatalities in Singapore, 2024 to 2025.' },
    { value: '11 to 27', label: 'Elderly pedestrian fatalities, 2024 to 2025.' },
  ],
  statsSource: 'Source: Singapore Police Force, Annual Road Traffic Situation 2025.',
  caveat:
    'These figures are not caused by phone use or by students. They show that road-safety education stays important.',
} as const;

export const GAME = {
  headline: 'The game.',
  lead: 'A short browser game. You cross Singapore-inspired roads while your phone competes for your attention. Safe decisions score. Unsafe decisions cost you for the rest of the run.',
  pledge: 'I solemnly swear not to check my phone while crossing.',
  pledgeButton: 'I promise.',
  pledgeNote: 'The game opens with this pledge. You see it again in the debrief.',
  rules: [
    { title: 'You only see where you look.', body: 'A vision cone follows your aim.' },
    { title: 'Green means cars are braking, not that the road is clear.', body: 'Some drivers run the red.' },
    { title: 'Cross between the dashed lines.', body: 'Crossing there on green pushes the wall back.' },
    {
      title: 'The warning triangle means do not cross yet.',
      body: 'A speeding car is coming and it sounds its horn.',
    },
    { title: 'Your message can wait.', body: 'Notifications queue. Answer them back on the pavement.' },
    { title: 'Keep moving.', body: 'A wall chases you. Waiting at a red signal pauses it.' },
    { title: 'Earphones are a real distraction.', body: 'While music plays you cannot hear the horn.' },
    {
      title: 'Failure is never graphic.',
      body: 'Every failed run names the unsafe decision and the real-world habit that would have prevented it.',
    },
  ],
  profilesTitle: 'Three profiles.',
  profiles: [
    { id: 'primary', name: 'Primary School.', body: 'Music on. You will not hear them coming.' },
    { id: 'teenager', name: 'Teenager.', body: 'Music, plus phone notifications that will not stop.' },
    { id: 'office', name: 'Office Worker.', body: 'Music, the boss, and a full cup of kopi.' },
  ],
  embedTitle: 'Try it here.',
  embedLoad: 'Load the game.',
  embedLoading: 'Loading the game.',
  embedFull: 'Open full screen.',
  embedNewPage: 'Open in a new page.',
  embedError: 'The game did not load. Open it in a new page.',
  embedHint: 'Arrow keys or WASD move. Space answers a message. Escape pauses.',
  embedPhone: 'On a phone, the game opens in its own page.',
  iframeTitle: 'Kerb Sense, the game',
} as const;

export const ROAD_BAND = ['Look.', 'Listen.', 'Cross.', 'Then check.'] as const;

export const BOOTH = {
  headline: 'The booth.',
  lead: 'A portable wooden tabletop arcade cabinet, built by the team. Students play on the booth, so nobody takes out a phone.',
  viewerTitle: 'Turn it. Take it apart.',
  viewerHint: 'Drag to rotate. Hover or tap a part to see its name.',
  explode: 'Explode.',
  assemble: 'Assemble.',
  loading: 'Loading the booth.',
  error: 'The 3D booth did not load. These are the flat renders.',
  reducedMotion: 'Motion is reduced on this device. These are the flat renders.',
  noWebgl: 'This browser cannot show 3D. These are the flat renders.',
  canvasLabel: 'A 3D model of the Kerb Sense arcade booth. Drag to rotate.',
  catalogueTitle: 'The parts.',
  specTitle: 'The specification.',
  specs: [
    ['Width', '61.7 cm'],
    ['Depth', '71.2 cm'],
    ['Height', '66.8 cm'],
    ['Material', '12 mm MDF or plywood, cut to size'],
    ['Screen', '24 inch monitor opening'],
    ['Controls', 'Four movement buttons and a joystick with a built-in button'],
    ['Access', 'Rear panel with two hinges and two latches'],
    ['Finish', 'Rounded edges and ventilation slots'],
    ['Stations', 'Three, one per school, plus one backup bundle'],
    ['Computer', 'Team-owned. The grant funds only the controls, connections and cabinet materials.'],
  ],
  where: 'The booth is set up only in safe, stationary areas inside schools.',
  elevationsAlt:
    'Three flat elevation drawings of the red booth: the front with the screen and controls, the side profile, and the back with the ventilation slots.',
} as const;

export const PROGRAMME = {
  headline: 'The programme.',
  lead: 'Six months, three schools.',
  months: [
    {
      month: 1,
      activities:
        'Permissions, matched baseline observations, student interviews, school and parental consent, final design lock.',
      outputs: 'Confirmed sites. Baseline dataset. Observation protocol.',
    },
    {
      month: 2,
      activities: 'Prototype refinement, accessibility work, playtesting with at least 30 students.',
      outputs: 'Pilot-ready game. Playtest report. Safety checklist.',
    },
    {
      month: 3,
      activities: 'Train ambassadors. Launch School A.',
      outputs: 'School A live. First session dataset.',
    },
    {
      month: 4,
      activities: 'Refine and launch School B. Continue School A.',
      outputs: 'School B live. Interim improvement log.',
    },
    {
      month: 5,
      activities: 'Launch School C. Interim observations at the earlier schools.',
      outputs: 'Three schools live. Interim observation dataset.',
    },
    {
      month: 6,
      activities: 'Impact report, open toolkit, three-school handover.',
      outputs: 'Impact report. Open toolkit. Three-school handover.',
    },
  ],
} as const;

export const TARGETS = {
  headline: 'The targets.',
  lead: 'Targets, not results. The pilot has not run yet.',
  badge: 'Target.',
  items: [
    { value: 900, prefix: '', suffix: '', label: 'student participants.' },
    { value: 1500, prefix: '', suffix: '', label: 'game sessions.' },
    { value: 20, prefix: '', suffix: '', label: 'student ambassadors trained.' },
    {
      value: 20,
      prefix: 'At least ',
      suffix: '%',
      label: 'relative reduction in visible phone use while crossing at the pilot sites.',
    },
    {
      value: 20,
      prefix: 'At least ',
      suffix: ' pt',
      label: 'improvement in safe-crossing rate between the first run and the coached replay.',
    },
    {
      value: 75,
      prefix: 'At least ',
      suffix: '%',
      label: 'of exit respondents recall the correct phone-check sequence.',
    },
  ],
  source: 'Source: the Kerb Sense proposal, section 6.',
  link: 'See the programme.',
} as const;

export const SAFETY = {
  headline: 'Safe by design.',
  big: SITE.safeLine,
  lead: 'The game teaches safe crossing. The campaign must never encourage phone use near a road.',
  items: [
    {
      title: 'No accounts and no profiles.',
      body: 'The game stores no personal data. It records only anonymous, aggregate session measures.',
    },
    {
      title: 'Failure is never graphic.',
      body: 'No collision is shown. A failed run cuts to a results screen that explains the decision.',
    },
    {
      title: 'Play only when stationary.',
      body: 'Play happens only in stationary school locations, with school staff present, after the school parental consent process.',
    },
    {
      title: 'Observation is anonymous.',
      body: 'Observers use anonymous tallies only. No photos, names or identifying details are collected.',
    },
    {
      title: 'Sound and motion controls.',
      body: 'The game supports reduced motion and keyboard navigation. Sound can be muted.',
    },
    {
      title: 'Students under 18.',
      body: 'All sessions are arranged through the school and run in the presence of a member of school staff.',
    },
  ],
} as const;

export const TEAM = {
  headline: 'The team.',
  lead: `${SITE.team}. Five students from Yishun Innova Junior College, Singapore Polytechnic and Ngee Ann Polytechnic.`,
  members: [
    { role: 'Project Lead', name: 'Brenden', institution: 'Singapore Polytechnic' },
    { role: 'Technical Lead', name: 'Justin', institution: 'Ngee Ann Polytechnic' },
    { role: 'Design Lead', name: 'Min', institution: 'Yishun Innova Junior College' },
    { role: 'Operations Lead', name: 'Wen Wei', institution: 'Singapore Polytechnic' },
    { role: 'Impact and Finance Lead', name: 'Jaden', institution: 'Singapore Polytechnic' },
  ],
} as const;

export const BUDGET = {
  headline: 'The budget.',
  lead: 'S$3,000 requested.',
  lines: [
    { category: 'Venue', amount: 0, colour: 'black' },
    { category: 'Marketing and publicity', amount: 450, colour: 'blue' },
    { category: 'Food and beverages', amount: 400, colour: 'yellow' },
    { category: 'Project materials and logistics', amount: 1300, colour: 'red' },
    { category: 'Professional costs', amount: 850, colour: 'lblue' },
  ],
  topTitle: 'Top items.',
  top: [
    'Three DIY cabinets, S$360.',
    'Four USB arcade control kits, S$140.',
    'A backup display and computer bundle, S$250.',
    'Original illustration and sound design, S$700.',
  ],
  note: 'No grant money goes to cash prizes or to team members.',
} as const;

export const FOOTER = {
  context: SITE.context,
  referencesTitle: 'References.',
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
    { href: 'privacy/', label: 'Privacy.' },
    { href: 'terms/', label: 'Terms of use.' },
    { href: 'cookies/', label: 'Cookies.' },
    { href: 'play/', label: 'Play.' },
  ],
  source: 'Source code on GitHub.',
  copyright: `© ${SITE.year} Kerb Sense.`,
} as const;
