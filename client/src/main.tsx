import '@/styles/index.css';

import React from 'react';

import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import ReactDOM from 'react-dom/client';

import App from '@/App';
import ReactQueryProvider from '@/providers/ReactQueryProvider';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ReactQueryProvider>
      <App />
      <ReactQueryDevtools />
    </ReactQueryProvider>
  </React.StrictMode>,
);
