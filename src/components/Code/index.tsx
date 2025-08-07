import React from 'react';
import Layout from '../Layout/Layout';
import VerificationInput from "react-verification-input";
import toast from 'react-hot-toast';
import { actions } from 'astro:actions';
import type { ICode } from '../../lib/types';

export interface IProps {
  code?: ICode
}

const Code: React.FunctionComponent<IProps> = ({ code }) => {
  const [value, setValue] = React.useState("");

  if (!code) {
    return <Layout><h1>Dette er ikke riktig</h1></Layout>
  }

  if (!!code.hint) {
    return <Layout>
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
    } else {
      toast.error("Ai, feil kode :(");
    }
  }

  return <Layout>
    <p className="text-2xl" style={{ 'whiteSpace': 'pre-line' }}>{code.assignment}</p>
    <VerificationInput length={code.length} onComplete={async (input) => await send(input)} onChange={(value) => {
      setValue(value)
    }} />
    <button onClick={async () => await send(value)}>Send inn kode</button>
  </Layout >
};

export default Code;

