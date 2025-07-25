import React from 'react';
import Layout from '../../Layout/Layout';
import type { Code } from '../../../lib/types';
import { ExpandableCard } from '../../utils/Expandable';
import Assignment from './Assignment';

export interface IProps {
  codes?: Code[]
}

const CodeOverview: React.FunctionComponent<IProps> = ({ codes }) => {
  if (!codes) {
    return <Layout><h1>Snakk med Steffen, dette er ikke riktig!</h1></Layout>
  }

  return <Layout>
    {codes.map((code, i) => {
      return <ExpandableCard key={`oppgave ${i}`} title={"Oppgave: " + (i + 1)}>
        <Assignment code={code} />
      </ExpandableCard>
    })}
  </Layout >
};

export default CodeOverview;

