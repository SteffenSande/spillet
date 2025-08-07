import React from 'react';
import Layout from '../Layout/Layout';
import VerificationInput from "react-verification-input";
import toast from 'react-hot-toast';
import { actions } from 'astro:actions';
import type { IFinalQuestion, Team } from '../../lib/types';
import ConfettiExplosion from 'react-confetti-explosion';


export interface IProps {
}

const FinalQuestionNotFound: React.FunctionComponent<IProps> = ({ }) => {
  return <Layout>
    <h1>Øye er dessverre ikke her? Rart, sjekk igjen seinere.</h1>
  </Layout>
};

export default FinalQuestionNotFound;

