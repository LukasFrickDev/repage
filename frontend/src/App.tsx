import { BrowserRouter } from 'react-router-dom';
import { AppErrorBoundary } from './app/AppErrorBoundary';
import { AppRoutes } from './app/router';
import { ConsentProvider } from './features/consent/ConsentProvider';

export function AppContent({ prerender = false }: { prerender?: boolean }) {
  return (
    <AppErrorBoundary prerender={prerender}>
      <ConsentProvider>
        <AppRoutes />
      </ConsentProvider>
    </AppErrorBoundary>
  );
}

const App = () => <BrowserRouter><AppContent /></BrowserRouter>;

export default App;
