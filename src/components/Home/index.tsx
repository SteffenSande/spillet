import React from 'react';
import Layout from '../Layout/Layout';
import type { Game, IFinalQuestion, User } from '../../lib/types';
import { ExpandableCard } from '../utils/Expandable';
import SvgMafiaGrande from '../images/MafiaGrande';

declare global {
  interface Window {
    __sseWorkerStarted?: boolean;
  }
}

export interface IProps {
  you?: User
  gameId: number
  game?: Game
  finalQuestion?: IFinalQuestion
}

const Home: React.FunctionComponent<IProps> = ({ gameId, game, you, finalQuestion }) => {
  if (!you || !game) {
    return <Layout gameId={gameId}>
      You need to scan your alias!
    </Layout>
  }

  return <Layout gameId={gameId}>
    <SvgMafiaGrande className='w-3/4 absolute -top-72 -z-10' />
    <div className='h-60' />
    <h1 className='text-3xl'>{you.name}</h1>
    <ExpandableCard title='Intro'>
      <p style={{ 'whiteSpace': 'pre-line' }}>{game.intro}</p>
    </ExpandableCard>
    <ExpandableCard title='Regler'>
      <p style={{ 'whiteSpace': 'pre-line' }}>{game.rules}</p>
    </ExpandableCard>
    {game.extraInformation.length > 0 && <ExpandableCard title='Ekstra informasjon'>
      {game.extraInformation.map((info, i) => {
        return <p style={{ 'whiteSpace': 'pre-line' }}>{info}</p>
      })}
    </ExpandableCard>}
    <ExpandableCard title='Beskrivelse'>
      <p style={{ 'whiteSpace': 'pre-line' }}>{you.description}</p>
    </ExpandableCard>
    <ExpandableCard title='Hemmelig beskrivelse'>
      <h3>Lag: {you.team}</h3>
      <p style={{ 'whiteSpace': 'pre-line' }}>{you.hiddenDescription}</p>
    </ExpandableCard>
    <a href={`/${gameId}/code/overview`}>Se oppgaver og hint</a>
    <a href={`/${gameId}/alias`}>Se oversikt og anklag en konkurent for å jobbe for et annet lag</a>
    {finalQuestion && <a href={`/${gameId}/finalQuestion/${finalQuestion.externalId}`}>Du har funnet koden, trykk her for å løse den</a>}
  </Layout>

};

export default Home;

