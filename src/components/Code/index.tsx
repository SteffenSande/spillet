import React from 'react';
import Layout from '../Layout/Layout';
import type { Codes } from '../../generated/prisma/client';
import VerificationInput from "react-verification-input";
import toast from 'react-hot-toast';
import { actions } from 'astro:actions';

export interface IProps {
  code?: {
    id: number,
    externalId: string,
    hint?: string
  }
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

  return <Layout>
    <VerificationInput length={4} onChange={(value) => {
      setValue(value)
    }} />
    <button onClick={async () => {
      const response = await actions.codeActions.send({
        externalId: code.externalId,
        code: value
      })
      if (response.data?.success) {
        window.location.reload();
      } else {
        toast.error("Ai, feil kode :(");
      }
    }}>Send inn kode</button>
  </Layout>
};

export default Code;

