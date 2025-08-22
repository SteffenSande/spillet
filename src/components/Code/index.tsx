import React from 'react';
import Layout from '../Layout/Layout';
import VerificationInput from "react-verification-input";
import toast from 'react-hot-toast';
import { actions } from 'astro:actions';
import type { ICode } from '../../lib/types';

export interface IProps {
  gameId: number
  code?: ICode
}

const Code: React.FunctionComponent<IProps> = ({ code, gameId }) => {
  const [value, setValue] = React.useState("");

  if (!code) {
    return <Layout gameId={gameId}><h1>Dette er ikke riktig</h1></Layout>
  }

  if (!!code.hint) {
    return <Layout gameId={gameId}>
      <h1>{code.hint}</h1>
    </Layout>
  }
  const send = async (input: string) => {
    const response = await actions.codeActions.send({
      externalId: code.externalId,
      code: input
    })
    if (response.data?.success) {
      window.location.reload();
    } else if (response.error) {
      toast.error(response.error.message);
    } else {
      toast.error("Ai, feil kode :(");
    }
  }

  return <Layout gameId={gameId}>
    <p className="text-2xl" style={{ 'whiteSpace': 'pre-line' }}>{code.assignment}</p>
    {code.imagePath && <img className='w-full bg-white p-4' src={code.imagePath} />}
    <VerificationInput length={code.length} onChange={(value) => {
      setValue(value)
    }} />
    <button onClick={async () => await send(value)}>Send inn kode</button>
  </Layout >
};

export default Code;

