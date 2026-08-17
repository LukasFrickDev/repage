import type { ErrorInfo, ReactNode } from 'react';
import { Component } from 'react';

type AppErrorBoundaryProps = { children: ReactNode; prerender?: boolean };
type AppErrorBoundaryState = { error: Error | null };

export class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): AppErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (this.props.prerender) throw error;
    void info;
  }

  render() {
    if (this.state.error) {
      if (this.props.prerender) throw this.state.error;
      return <main role="alert"><h1>Não foi possível carregar esta página.</h1><p>Atualize a página e tente novamente.</p></main>;
    }
    return this.props.children;
  }
}
