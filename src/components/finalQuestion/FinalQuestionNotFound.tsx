import React from 'react';
import Layout from '../Layout/Layout';
import VerificationInput from "react-verification-input";
import toast from 'react-hot-toast';
import { actions } from 'astro:actions';
import type { IFinalQuestion, Team } from '../../lib/types';
import ConfettiExplosion from 'react-confetti-explosion';


export interface IProps {
  gameId: number
}

const FinalQuestionNotFound: React.FunctionComponent<IProps> = ({ gameId }) => {
  return <Layout gameId={gameId}>
    <h1>Formelen er dessverre ikke her enda, men vil dukke opp her seinere.</h1>
  </Layout>
};

export default FinalQuestionNotFound;

