import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../styles/tokens.css';
import PolicyPage, { PolicyHeading, PolicyList, PolicyText } from './PolicyPage';

function Privacy() {
  return (
    <PolicyPage
      title="Privacy."
      lead="This site collects no personal data. It sets no cookies. The game stores nothing."
    >
      <PolicyHeading>What this site collects.</PolicyHeading>
      <PolicyText>Nothing. This website has no accounts, no forms, no analytics and no tracking.</PolicyText>
      <PolicyList
        items={[
          'We do not collect names, email addresses, phone numbers or any other personal data.',
          'We do not use analytics or advertising services.',
          'We do not load scripts, fonts or images from other companies.',
          'GitHub serves the files. GitHub may keep standard server logs. See the GitHub Privacy Statement.',
        ]}
      />

      <PolicyHeading>What the game stores.</PolicyHeading>
      <PolicyText>
        The game at /play/ runs in your browser. It keeps its score and settings in memory only, for the
        current run. It writes nothing to your device. It uses no localStorage, no cookies and no account.
        When you close the page, everything is gone.
      </PolicyText>

      <PolicyHeading>The one thing the site remembers.</PolicyHeading>
      <PolicyText>
        If you press &ldquo;Show the grid.&rdquo;, the site saves one value in your browser (localStorage, key
        &ldquo;kerb-sense:grid&rdquo;) so the grid stays on when you come back. It holds no personal data. You
        can clear it in your browser settings.
      </PolicyText>

      <PolicyHeading>The schools programme.</PolicyHeading>
      <PolicyText>
        In schools, the team records only anonymous aggregate session counts from the booth. Observers use
        anonymous tallies. No photos, names or identifying details are collected. Sessions run with school
        staff present, after the school parental consent process. This follows the Personal Data Protection
        Act 2012 and the PDPC guidance on children&rsquo;s personal data.
      </PolicyText>

      <PolicyHeading>Data retention.</PolicyHeading>
      <PolicyText>
        This site keeps no data, so there is nothing to retain or delete. If the team adds analytics later, it
        will be cookieless and aggregate, and this page will state the retention period.
      </PolicyText>

      <PolicyHeading>Contact.</PolicyHeading>
      <PolicyText>
        The team has no public contact address yet. Questions about this policy can be raised as an issue on
        the project repository on GitHub.
      </PolicyText>

      <PolicyHeading>Changes.</PolicyHeading>
      <PolicyText>
        This page was last changed on 2 October 2026. Changes are recorded in the git history of the site.
      </PolicyText>
    </PolicyPage>
  );
}

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <StrictMode>
      <Privacy />
    </StrictMode>,
  );
}
