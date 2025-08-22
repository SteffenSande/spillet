import React from 'react';
import { actions } from 'astro:actions';
import Layout from '../Layout/Layout';
import { Textarea } from '../ui/textarea';
import { Label } from '@radix-ui/react-label';
import type { Game } from '@/lib/types';
import { Button } from '../ui/button';
import { FaPlus } from 'react-icons/fa';
import EditAbleExtraInformation from './EditAbleExtraInformation';

declare global {
  interface Window {
    __sseWorkerStarted?: boolean;
  }
}

export interface IProps {
  gameId: number,
  game: {
    extraInformation: {
      id: number;
      gamesId: number | null;
      text: string;
    }[];
  } & {
    name: string;
    id: number;
    maxGuesses: number;
    nrOfCorrectGuessesToKill: number;
    canFindFinalQuestion: boolean;
    rules: string;
    intro: string;
  }
  codes: {
    externalId: string,
    assignment: string
  }[]
  alias: {
    externalId: string
  }[]
  finalQuestion: {
    externalId: string
  }
}

const Admin: React.FunctionComponent<IProps> = ({ gameId, codes, alias, finalQuestion, game }) => {
  const [extraInfo, setExtraInfo] = React.useState("");

  return <Layout gameId={gameId}>
    <h3 className='text-3xl'>Oppgaver:</h3>
    {codes.map((code, i) => {
      return <a key={`code-${i}`} href={`code/${code.externalId}`}>{code.assignment}</a>
    })}
    <h3 className='text-3xl'>Aliaser:</h3>
    {alias.map((item, i) => {
      return <a key={`alias-${i}`} href={`alias/${item.externalId}`}>Alias {i + 1}</a>
    })}

    <h3 className='text-3xl'>FinalQuestion:</h3>
    <a href={`finalQuestion/${finalQuestion.externalId}`}>final</a>
    {/* <button onClick={async () => {
      await actions.hints.send({
        text: "heisann",
        user:
      })
    }}>Send</button> */}

    <h3 className='text-3xl self-baseline'>Extra information:</h3>
    <div className='w-full rounded-none gap-4 grid grid-cols-[1fr_auto] items-end'>
      {game.extraInformation?.map((info, i) => {
        // make component
        return <EditAbleExtraInformation key={`${i}-info`} gameId={gameId} extraInformation={info} />
      })}
      <EditAbleExtraInformation gameId={gameId} extraInformation={{
        text: ""
      }} />
    </div>
    {/* <button  onClick={async () => {
      await actions.hints.kill()
    }}>Kill</button> */}
  </Layout>
};

export default Admin;

