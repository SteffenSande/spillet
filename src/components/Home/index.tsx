import React from 'react';
import { getQueryClient } from '../../store/Query';
import { QueryClientProvider } from '@tanstack/react-query';
import { useSSEHints } from '../hooks/sse';
import { actions } from 'astro:actions';
import Layout from '../Layout/Layout';
import type { Alias } from '../../generated/prisma/client';
import type { User } from '../../lib/types';
import { ExpandableCard } from '../utils/Expandable';
import VerificationInput from 'react-verification-input';

declare global {
  interface Window {
    __sseWorkerStarted?: boolean;
  }
}

export interface IProps {
  codes: {
    externalId: string
  }[]
  alias: {
    externalId: string
  }[]
  you?: User
}

const Home: React.FunctionComponent<IProps> = ({ you, codes, alias }) => {

  if (!you) {
    return <Layout>
      You need to scan your alias!
      <h3 className='text-3xl'>Oppgaver:</h3>
      {codes.map((code, i) => {
        return <a href={`/code/${code.externalId}`}>Oppgave {i + 1}</a>
      })}
      <h3 className='text-3xl'>Aliaser:</h3>
      {alias.map((item, i) => {
        return <a href={`/alias/${item.externalId}`}>Alias {i + 1}</a>
      })}

      <button onClick={async () => {
        await actions.hints.send("Heisann")
      }}>Send</button>
    </Layout>
  }

  return <Layout>
    <h1 className='text-3xl'>{you.name}</h1>
    <ExpandableCard title='Beskrivelse'>
      <p>{you.description}</p>
    </ExpandableCard>
    <ExpandableCard title='Hemmelig beskrivelse'>
      <p>{you.hiddenDescription}</p>
    </ExpandableCard>

    <a href='/code/overview'>Se oppgaver og hint</a>
    <a href='/stemme'>Stem</a>
  </Layout>

};

export default Home;

