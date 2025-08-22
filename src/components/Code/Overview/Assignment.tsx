import React from 'react';
import type { ICodeOverview } from '../../../lib/types';
import { FaCheck, FaSearch, FaTimes } from 'react-icons/fa';

export interface IProps {
  gameId: number,
  code: ICodeOverview
}

const Assignment: React.FunctionComponent<IProps> = ({
  code,
  gameId
}) => {
  const foundNotSolved = code.assignment && !code.hint
  const solved = code.hint

  if (foundNotSolved) {
    return <div className='flex items-center gap-4'>
      <FaSearch />
      <div className='flex gap-4 flex-col'>
        <p>{code.assignment}</p>
        <a href={`/${gameId}/code/${code.externalId}`}>Gå til opppgave</a>
      </div>
    </div >
  }
  if (solved) {
    return <div className='flex items-center gap-4'>
      <FaCheck />
      <p>{code.hint}</p></div>
  }

  return <div className='flex items-center gap-4'>
    <FaTimes />
    <p>Ikke funnet</p>
  </div>
};

export default Assignment;

