import React from 'react';
import Layout from '../Layout/Layout';
import type { IFinalQuestion, User } from '../../lib/types';
import { ExpandableCard } from '../utils/Expandable';
import SvgMafiaGrande from '../images/MafiaGrande';
import type { FinalQuestion } from '../../generated/prisma/client';

declare global {
  interface Window {
    __sseWorkerStarted?: boolean;
  }
}

export interface IProps {
  you?: User
  finalQuestion?: IFinalQuestion
}

const Home: React.FunctionComponent<IProps> = ({ you, finalQuestion }) => {

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
      <p style={{ 'whiteSpace': 'pre-line' }}>{you.description}</p>
    </ExpandableCard>
    <ExpandableCard title='Hemmelig beskrivelse'>
      <h3>Lag: {you.team}</h3>
      <p style={{ 'whiteSpace': 'pre-line' }}>{you.hiddenDescription}</p>
    </ExpandableCard>
    <a href='/code/overview'>Se oppgaver og hint</a>
    <a href='/alias'>Se oversikt og anklag en konkurent for å jobbe for et annet lag</a>
    {finalQuestion && <a href={`/finalQuestion/${finalQuestion.externalId}`}>Du har funnet koden, trykk her for å løse den</a>}
  </Layout>

};

export default Home;

