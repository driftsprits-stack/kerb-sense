import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../styles/tokens.css';
import PolicyPage, { PolicyHeading, PolicyList, PolicyText } from './PolicyPage';

// The privacy and cookies policy. It keeps three things separate: this
// website, the live game and the planned school programme (CONTENT.md).
function Privacy() {
  return (
    <PolicyPage
      title="Privacy and cookies."
      lead="This website collects nothing. The game stores nothing. The school programme has not started."
    >
      <PolicyHeading>This website</PolicyHeading>
      <PolicyText>
        This website collects no personal data. It has no accounts, no forms, no analytics and no tracking.
      </PolicyText>
      <PolicyList
        items={[
          'We do not collect names, email addresses, phone numbers or any other personal data.',
          'We do not use analytics or advertising services.',
          'We do not load scripts, fonts or images from other companies. The two fonts are served from this site.',
          'GitHub serves the files. GitHub may keep standard server logs under the GitHub Privacy Statement.',
        ]}
      />

      <PolicyHeading>Cookies and browser storage</PolicyHeading>
      <PolicyText>
        This website sets no cookies of any kind. There is no cookie banner because there is nothing to
        consent to. The website keeps one setting in localStorage when you press &ldquo;Show the grid&rdquo;:
        the key &ldquo;kerb-sense:grid&rdquo; with the value 1 or 0. It holds no personal data and never
        leaves your browser. You can clear it in your browser settings. The display text that changes on each
        visit is picked at random and is not stored.
      </PolicyText>

      <PolicyHeading>The live game</PolicyHeading>
      <PolicyText>
        The game at /play/ runs in your browser and stores nothing. We checked the game code on 2 October
        2026: it uses no localStorage, no sessionStorage, no IndexedDB, no cookies and no network requests.
        When you close the page, everything is gone.
      </PolicyText>

      <PolicyHeading>The planned school programme</PolicyHeading>
      <PolicyText>
        The programme has not started. At the booths, the team plans to count anonymous, aggregate session
        numbers, with no accounts and no personal profiles, plus anonymous observation tallies at crossings.
        No photos, names or identifying details would be collected. Sessions would run with school staff
        present, after the school parental consent process. This follows the Personal Data Protection Act 2012
        and the PDPC guidance on children&rsquo;s personal data.
      </PolicyText>

      <PolicyHeading>Data retention</PolicyHeading>
      <PolicyText>
        This website keeps no data, so there is nothing to retain or delete. If the team adds analytics later,
        it will be cookieless and aggregate, and this page will state the retention period.
      </PolicyText>

      <PolicyHeading>Contact</PolicyHeading>
      <PolicyText>
        The team has no public contact address yet. You can raise a question as an issue on the project
        repository on GitHub.
      </PolicyText>

      <PolicyHeading>Changes</PolicyHeading>
      <PolicyText>
        This page was last changed on 3 October 2026. Changes are recorded in the git history of the site.
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
