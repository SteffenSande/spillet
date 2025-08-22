import React from 'react';
import Layout from '../../Layout/Layout';
import type { ICodeOverview } from '../../../lib/types';
import Assignment from './Assignment';

export interface IProps {
  codes?: ICodeOverview[]
  gameId: number
}

const CodeOverview: React.FunctionComponent<IProps> = ({ gameId, codes }) => {
  if (!codes) {
    return <Layout gameId={gameId}><h1>Snakk med Steffen, dette er ikke riktig!</h1></Layout>
  }

  return <Layout gameId={gameId}>
    {codes.map((code, i) => {
      return <div
        key={`oppgave ${i}`}
        className={`px-3 py-2 bg-teal-700 rounded-lg shadow-lg w-full gap-4 flex flex-col`}>
        <Assignment gameId={gameId} code={code} />
      </div>

    })}
  </Layout >
};

export default CodeOverview;

