import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../styles/tokens.css';
import PolicyPage, { PolicyHeading, PolicyList, PolicyText } from './PolicyPage';

function Terms() {
  return (
    <PolicyPage
      title="Terms of use."
      lead="Kerb Sense is a free educational project. Use it at your own risk. Play only when you are stationary and safe."
    >
      <PolicyHeading>What this is.</PolicyHeading>
      <PolicyText>
        Kerb Sense is a free browser game and schools programme made by a student team for Delta Challenge
        2026, Track B. It is not a commercial product. Nothing is sold on this site.
      </PolicyText>

      <PolicyHeading>Play safely.</PolicyHeading>
      <PolicyList
        items={[
          'Stop somewhere safe before you play.',
          'Do not play while you walk, cycle, drive or cross a road.',
          'The game teaches safe crossing. It is not a substitute for real road-safety training or for your own attention on the road.',
        ]}
      />

      <PolicyHeading>No warranty.</PolicyHeading>
      <PolicyText>
        The site and the game are provided as they are, without any warranty. The team does not promise that
        the site is free of errors or always available. To the extent the law allows, the team is not liable
        for any loss that comes from using this site.
      </PolicyText>

      <PolicyHeading>Game rules.</PolicyHeading>
      <PolicyList
        items={[
          'Cross between the dashed lines.',
          'Wait for the green signal, and look anyway.',
          'Answer messages back on the pavement.',
          'Failure is never graphic. Each failed run names the unsafe decision.',
        ]}
      />

      <PolicyHeading>Content and copyright.</PolicyHeading>
      <PolicyText>
        The game, the booth renders, the logo and the text on this site belong to the Kerb Sense team. The
        source code is published on GitHub under the licence stated there. The site uses no third-party
        assets. The Singapore Police Force, the National Crime Prevention Council and the National Youth
        Council are named as the organisers and funders of the challenge. Their names are not used as
        endorsement, and their logos are not used.
      </PolicyText>

      <PolicyHeading>Governing law.</PolicyHeading>
      <PolicyText>These terms are governed by the laws of Singapore.</PolicyText>

      <PolicyHeading>Changes.</PolicyHeading>
      <PolicyText>This page was last changed on 2 October 2026.</PolicyText>
    </PolicyPage>
  );
}

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <StrictMode>
      <Terms />
    </StrictMode>,
  );
}
