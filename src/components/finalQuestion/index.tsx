import React from 'react';
import Layout from '../Layout/Layout';
import VerificationInput from "react-verification-input";
import toast from 'react-hot-toast';
import { actions } from 'astro:actions';
import type { IFinalQuestion, Team } from '../../lib/types';
import ConfettiExplosion from 'react-confetti-explosion';


export interface IProps {
  finalQuestion?: IFinalQuestion
  initWinnerTeam?: Team
  teams?: Team[]
}

const FinalQuestion: React.FunctionComponent<IProps> = ({ finalQuestion, initWinnerTeam, teams }) => {
  const [value, setValue] = React.useState("");
  const [winnerTeam, setWinnerTeam] = React.useState<Team | undefined>(initWinnerTeam)

  if (!finalQuestion) {
    return <Layout><h1>Dette er ikke riktig</h1></Layout>
  }

  if (!!winnerTeam) {
    return <Layout>
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
    } else {
      toast.error("Ai, feil kode :(");
    }
  }

  return <Layout>
    <p className="text-2xl">{finalQuestion.assignment}</p>
    <VerificationInput length={finalQuestion.codeLength} onComplete={async (input) => await send(input)} onChange={(value) => {
      setValue(value)
    }} />

    <div className='w-full grid grid-cols-2 gap-4 justify-between'>
      {teams && teams.map(team => {
        return <button onClick={async () => {
          await send(value)
        }}>{team.name}</button>
      })}
    </div>
  </Layout>
};

export default FinalQuestion;

