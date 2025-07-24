import React from 'react';
import { getQueryClient } from '../../store/Query';
import { QueryClientProvider } from '@tanstack/react-query';
import { useSSEHints } from '../hooks/sse';
import { actions } from 'astro:actions';
import Layout from '../Layout/Layout';

declare global {
  interface Window {
    __sseWorkerStarted?: boolean;
  }
}

export interface IProps {
}

const Home: React.FunctionComponent<IProps> = ({ }) => {

  return <Layout>
    <button onClick={async () => {
      await actions.hints.send("Heisann")
    }}>Send</button>
  </Layout>

};

export default Home;

