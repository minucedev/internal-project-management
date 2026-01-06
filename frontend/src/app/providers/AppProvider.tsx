import { type ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import QueryProvider from './QueryProvider';
import { ToastProvider } from '@/shared/components/feedback';

interface AppProviderProps {
  children: ReactNode;
}

export default function AppProvider({ children }: AppProviderProps) {
  return (
    <BrowserRouter>
      <QueryProvider>
        {children}
        <ToastProvider />
      </QueryProvider>
    </BrowserRouter>
  );
}
