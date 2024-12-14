import '@/styles/index.css';

import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React from 'react';
import ReactDOM from 'react-dom/client';

import App from '@/App';
import ReactQueryProvider from '@/presentation/providers/ReactQueryProvider';
import ToastProvider from '@/presentation/providers/ToastProvider';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ReactQueryProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
      <ReactQueryDevtools />
    </ReactQueryProvider>
  </React.StrictMode>,
);
