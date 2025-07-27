import React from 'react';
import { actions } from 'astro:actions';
import Layout from '../Layout/Layout';
import type { User } from '../../lib/types';

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
}

const Admin: React.FunctionComponent<IProps> = ({ codes, alias }) => {

  return <Layout>
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
};

export default Admin;

