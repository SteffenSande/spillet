import React from 'react';
import Layout from '../../Layout/Layout';
import type { ICode } from '../../../lib/types';
import { ExpandableCard } from '../../utils/Expandable';
import Assignment from './Assignment';

export interface IProps {
  codes?: ICode[]
}

const CodeOverview: React.FunctionComponent<IProps> = ({ codes }) => {
  if (!codes) {
    return <Layout><h1>Snakk med Steffen, dette er ikke riktig!</h1></Layout>
  }

  return <Layout>
    {codes.map((code, i) => {
      return <div
        key={`oppgave ${i}`}
        className={`p-4 bg-teal-700 rounded-lg shadow-lg w-full gap-4 flex flex-col`}>
        <Assignment code={code} />
      </div>

    })}
  </Layout >
};

export default CodeOverview;

