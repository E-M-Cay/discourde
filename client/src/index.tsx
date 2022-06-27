import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { PeerSocketContext, socket, peer } from './context/PeerSocket';
import { Provider } from 'react-redux';
import { store } from './redux/store';
let toto: Record<string, string[]>;
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <PeerSocketContext.Provider value={{ socket, peer }}>
      <Provider store={store}>
        <App />
      </Provider>
    </PeerSocketContext.Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
