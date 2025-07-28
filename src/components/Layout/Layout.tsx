import React from 'react';
import { useServerActions } from '../hooks/sse';
import { QueryClientProvider } from '@tanstack/react-query';
import { getQueryClient } from '../../store/Query';
import HintToast from './HintToast';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import HomeButton from './HomeButton';

export interface IProps {
  children: React.ReactNode
}

const Layout: React.FunctionComponent<IProps> = ({ children }) => {
  const { serverAction } = useServerActions();
  React.useEffect(() => {
    if (serverAction?.type === "hint") {
      toast(serverAction.message);
    }
    if (serverAction?.type === "kill") {
      window.location.reload();
    }
  }, [serverAction])

  React.useEffect(() => {
    const user = Cookies.get("session");
    if (!user) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        Cookies.set('session', storedUser);
        window.location.reload();
      }
    }
  }, [])

  return <QueryClientProvider
    client={getQueryClient()}
  >
    <div className='p-4 flex flex-col gap-4 w-full'>
      <nav>
        <HomeButton></HomeButton>
      </nav>
      <div className='flex items-center flex-col w-full gap-4'>
        {children}
      </div>
      <HintToast />
    </div>
  </QueryClientProvider >
};

export default Layout;

