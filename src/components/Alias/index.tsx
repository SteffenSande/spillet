import React from 'react';
import Layout from '../Layout/Layout';
import type { Alias } from '../../generated/prisma/client';
import { navigate } from 'astro/virtual-modules/transitions-router.js';
import Cookies from 'js-cookie';

export interface IProps {
  alias?: Alias
}

const Profile: React.FunctionComponent<IProps> = ({ alias }) => {
  React.useEffect(() => {
    if (alias) {
      localStorage.setItem("user", alias.externalId)
      Cookies.set('session', alias.externalId);
    }
  })

  if (!alias) {
    return <Layout><h1>Ukjent</h1></Layout>
  }
  else {
    navigate("/")
  }
};

export default Profile;

