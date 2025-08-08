import React from 'react';
import Layout from '../Layout/Layout';
import SvgMafiaGrande from '../images/MafiaGrande';
import type { Game } from '../../lib/types';

declare global {
  interface Window {
    __sseWorkerStarted?: boolean;
  }
}

export interface IProps {
  game: Game
}

const Intro: React.FunctionComponent<IProps> = ({ game }) => {
  return <Layout>
    <SvgMafiaGrande className='w-3/4 absolute -top-72 -z-10' />
    <div className='h-60' />
    <p className='' style={{ 'whiteSpace': 'pre-line' }}>{game.intro}</p>
    <p className='' style={{ 'whiteSpace': 'pre-line' }}>{game.rules}</p>
  </Layout >
};

export default Intro;

