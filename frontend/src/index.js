// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { Provider } from 'react-redux'; // Redux provider
import { PersistGate } from 'redux-persist/integration/react'; // Redux Persist integration
import store, { persistor } from './redux/store'; // Store and persistor setup
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS
import { PageTitleProvider } from './Pages/PageTitleContext'; // Import PageTitleContext provider

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PageTitleProvider> 
          <App />
        </PageTitleProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
