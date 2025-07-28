import React from 'react';
import Layout from '../Layout/Layout';
import type { User } from '../../lib/types';
import { ExpandableCard } from '../utils/Expandable';
import SvgMafiaGrande from '../images/MafiaGrande';

declare global {
  interface Window {
    __sseWorkerStarted?: boolean;
  }
}

export interface IProps {
  you?: User
}

const Home: React.FunctionComponent<IProps> = ({ you }) => {

  if (!you) {
    return <Layout>
      You need to scan your alias!
    </Layout>
  }

  return <Layout>
    <SvgMafiaGrande className='w-3/4 absolute -top-72 -z-10' />
    <div className='h-60' />
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

