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
}

const Killed: React.FunctionComponent<IProps> = ({ }) => {
  // const [hint, setHint] = React.useState("");


  return <Layout>
    <SvgMafiaGrande className='w-3/4 absolute -top-72 -z-10' />
    <div className='h-60' />
    your dead
    {/* <input type="text" value={hint} onChange={e => {
      setHint(e.target.value);
    }} />
    <button onClick={() => {
      actions.hints.send(hint)
    }}> Sent hint</button> */}
  </Layout >

};

export default Killed;

