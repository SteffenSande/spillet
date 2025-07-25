import React from 'react';
import type { Code } from '../../../lib/types';

export interface IProps {
  code: Code
}

const Assignment: React.FunctionComponent<IProps> = ({
  code
}) => {
  const foundNotSolved = code.assignment && !code.hint
  const solved = code.hint

  if (foundNotSolved) {
    return <>
      <p>{code.assignment}</p>
      <a href={`/code/${code.externalId}`}>Gå til opppgave</a>
    </>
  }
  if (solved) {
    return <p>{code.hint}</p>
  }

  return <p>"Ikke funnet"</p>
};

export default Assignment;

