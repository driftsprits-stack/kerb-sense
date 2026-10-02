import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../styles/tokens.css';
import PolicyPage, { PolicyHeading, PolicyList, PolicyText } from './PolicyPage';

function Cookies() {
  return (
    <PolicyPage title="Cookies." lead="This site sets no cookies.">
      <PolicyHeading>No cookies.</PolicyHeading>
      <PolicyText>
        This site does not set cookies of any kind. There are no analytics cookies, no advertising cookies and
        no session cookies. That is why there is no cookie banner: there is nothing to consent to.
      </PolicyText>

      <PolicyHeading>Local storage.</PolicyHeading>
      <PolicyText>The site uses browser localStorage for one setting:</PolicyText>
      <PolicyList
        items={[
          'kerb-sense:grid. Whether you turned on &ldquo;Show the grid.&rdquo;. The value is 1 or 0. It never leaves your browser.',
        ]}
      />
      <PolicyText>The game at /play/ uses no localStorage and no cookies.</PolicyText>

      <PolicyHeading>Third parties.</PolicyHeading>
      <PolicyText>
        The site loads nothing from third-party services. GitHub Pages serves the files and may set no cookies
        for this site.
      </PolicyText>

      <PolicyHeading>Changes.</PolicyHeading>
      <PolicyText>This page was last changed on 2 October 2026.</PolicyText>
    </PolicyPage>
  );
}

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <StrictMode>
      <Cookies />
    </StrictMode>,
  );
}
