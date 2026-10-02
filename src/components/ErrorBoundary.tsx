import { Component, type ErrorInfo, type ReactNode } from 'react';

// Wraps the 3D viewer and the clip (WEBSITE-STANDARDS E18). On an error it
// shows the fallback and logs to the console only, with no personal data.
interface Props {
  fallback: ReactNode;
  children: ReactNode;
  name: string;
}

interface State {
  failed: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  override state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error(`[kerb-sense] ${this.props.name} failed.`, error.message, info.componentStack);
  }

  override render(): ReactNode {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
