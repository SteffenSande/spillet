import React from 'react';
import Layout from '../Layout/Layout';
import type { Alias } from '../../generated/prisma/client';

export interface IProps {
  alias?: Alias
}

const Profile: React.FunctionComponent<IProps> = ({ alias }) => {

  React.useEffect(() => {
    if (alias) {
      localStorage.setItem("user", alias?.externalId)
    }
  });

  if (!alias) {
    return <Layout><h1>Ukjent</h1></Layout>
  }

  return <Layout>
    <h1>{alias.name}</h1>
    <h2>{alias.description}</h2>
  </Layout>
};

export default Profile;

