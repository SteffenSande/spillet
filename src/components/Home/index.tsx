import React from 'react';
import Layout from '../Layout/Layout';
import type { User } from '../../lib/types';
import { ExpandableCard } from '../utils/Expandable';

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
    </Layout>
  }

  return <Layout>
    <img src="/assets/MafiaGrande.svg"></img>
    <h1 className='text-3xl'>{you.name}</h1>
    <ExpandableCard title='Beskrivelse'>
      <p>{you.description}</p>
    </ExpandableCard>
    <ExpandableCard title='Hemmelig beskrivelse'>
      <p>{you.hiddenDescription}</p>
    </ExpandableCard>

    <a href='/code/overview'>Se oppgaver og hint</a>
    <a href='/alias'>Se oversikt og anklag en konkurent for å jobbe for et annet lag</a>
  </Layout>

};

export default Home;

