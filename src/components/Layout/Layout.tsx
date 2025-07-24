import React from 'react';
import { useSSEHints } from '../hooks/sse';
import { QueryClientProvider } from '@tanstack/react-query';
import { getQueryClient } from '../../store/Query';
import HintToast from './HintToast';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';

export interface IProps {
  children: React.ReactNode
}

const Layout: React.FunctionComponent<IProps> = ({ children }) => {
  const { hint, isMaster } = useSSEHints();
  React.useEffect(() => {
    if (hint) {
      toast(hint);
    }
  }, [hint])

  React.useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      Cookies.set('session', user);
    }
  }, [])

  return <QueryClientProvider
    client={getQueryClient()}
  >
    <div className='flex justify-center items-center flex-col h-[100vh] w-full gap-4'>
      {children}
    </div>

    <HintToast />
  </QueryClientProvider >
};

export default Layout;

