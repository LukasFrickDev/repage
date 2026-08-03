import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '../src/store';
import GlobalStyles from './styles/globalStyles';
import Rotas from './routes';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <GlobalStyles />
      <BrowserRouter>
        <Rotas />
      </BrowserRouter>
    </Provider>
  );
};

export default App;
