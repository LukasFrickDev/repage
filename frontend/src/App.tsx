import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './app/router';
import { ConsentProvider } from './features/consent/ConsentProvider';

const App = () => {
  return (
    <BrowserRouter>
      <ConsentProvider>
        <AppRoutes />
      </ConsentProvider>
    </BrowserRouter>
  );
};

export default App;
