import React from 'react';
import Layout from '../Layout/Layout';
import SvgMafiaGrande from '../images/MafiaGrande';
// import { actions } from 'astro:actions';

declare global {
  interface Window {
    __sseWorkerStarted?: boolean;
  }
}

export interface IProps {
  gameId: number
}

const Killed: React.FunctionComponent<IProps> = ({ gameId }) => {
  return <Layout gameId={gameId}>
    <SvgMafiaGrande className='w-3/4 absolute -top-72 -z-10' />
    <div className='h-60' />
    <p>Du er ute av spillet da 2 andre deltagere har gjettet ditt lag.</p>
  </Layout >

};

export default Killed;

