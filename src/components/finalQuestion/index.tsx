import React from 'react';
import Layout from '../Layout/Layout';
import VerificationInput from "react-verification-input";
import toast from 'react-hot-toast';
import { actions } from 'astro:actions';
import type { IFinalQuestion, Team } from '../../lib/types';
import ConfettiExplosion from 'react-confetti-explosion';
import { Label } from '@radix-ui/react-label';


export interface IProps {
  gameId: number
  finalQuestion?: IFinalQuestion
  initWinnerTeam?: Team
  teams?: Team[]
}

const FinalQuestion: React.FunctionComponent<IProps> = ({ gameId, finalQuestion, initWinnerTeam, teams }) => {
  const [value, setValue] = React.useState("");
  const [winnerTeam, setWinnerTeam] = React.useState<Team | undefined>(initWinnerTeam)

  if (!finalQuestion) {
    return <Layout gameId={gameId}><h1>Dette er ikke riktig</h1></Layout>
  }

  if (!!winnerTeam) {
    return <Layout gameId={gameId}>
      <ConfettiExplosion />
      <h1>Vinnerlaget er: {winnerTeam.name}</h1>
    </Layout>
  }


  const send = async (input: string) => {
    const response = await actions.finalQuestionActions.send({
      externalId: finalQuestion.externalId,
      code: input
    })
    if (response.data?.success) {
      setWinnerTeam(response.data.team)
    } else if (response.error) {
      toast.error(response.error.message);
    } else {
      toast.error("Ai, feil kode :(");
    }
  }

  return <Layout gameId={gameId}>
    <p className="text-2xl">{finalQuestion.assignment}</p>
    <p>Pass på, hvis det er feil må du vente 5 min til du kan prøve igjen</p>
    <VerificationInput
      classNames={
        {
          character: "rounded-lg"
        }
      }
      placeholder=''
      length={finalQuestion.codeLength} onChange={(value) => {
        setValue(value)
      }} />
    <button onClick={async () => {
      await send(value)
    }}>Send inn</button>
  </Layout>
};

export default FinalQuestion;

