import React from 'react';
import type { PublicUser, Team } from '../../lib/types';
import Layout from '../Layout/Layout';
import { ExpandableCard } from '../utils/Expandable';
import { actions } from 'astro:actions';

export interface IProps {
  publicUsers?: PublicUser[]
  teams?: Team[]
}

const AliasOverview: React.FunctionComponent<IProps> = ({
  publicUsers,
  teams
}) => {
  const [confirmVote, setConfirmVote] = React.useState<number | undefined>()

  if (!publicUsers || !teams) {
    return <>This shouldn't happen. Talk to Steffen.</>
  };
  return <Layout>
    <>
      {publicUsers.map(user => {
        return <ExpandableCard title={user.name}>
          <p>{user.description}</p>
          <h3>Vil du bruke stemmen din på å si hvilket lag {user.name} er på?</h3>
          <div className='w-full grid grid-cols-2 gap-4 justify-between'>
            {!confirmVote && teams.map(team => {
              return <button onClick={() => {
                setConfirmVote(team.id)
              }}>{team.name}</button>
            })}
            {confirmVote && <button onClick={async () => {
              const noe = await actions.vote.send({
                id: user.id,
                team: confirmVote
              })
              if (noe.error) {
                alert(noe.error.message);
              }
              setConfirmVote(undefined)
            }}>
              Du vil si at {user.name} er en del av {teams.find(team => team.id === confirmVote)?.name}
            </button>}
          </div>
        </ExpandableCard>
      })}
    </>
  </Layout >
};

export default AliasOverview;

