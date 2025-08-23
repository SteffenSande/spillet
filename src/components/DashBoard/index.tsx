import type { DashboardCode, DashboardGame } from '@/lib/dashboard';
import React from 'react';
import { Card, CardTitle } from '../ui/card';
import { ExpandableCard } from '../utils/Expandable';

export interface IProps {
  game: DashboardGame,
  codes: DashboardCode
}

const DashBoard: React.FunctionComponent<IProps> = ({ game, codes }) => {

  return <div className='grid gap-4 p-4'>
    <h1 className='w-full'>{game.name}</h1>
    <div className='grid grid-cols-4 gap-4'>
      {game.teams.map(team => {
        const aliases = team.Alias;
        const teamFoundCodes = new Map<number, number>();
        aliases.forEach(alias => {
          alias.CodeFound.forEach(found => {
            teamFoundCodes.set(found.codesId, (teamFoundCodes.get(found.codesId) || 0) + 1)
          })
        },)
        return <Card className='p-4'>
          <CardTitle>{team.name}</CardTitle>
          <p>Antall: {team.Alias.length}</p>
          <div className='grid grid-cols-2'>
            <p>Oppgave</p>
            <p>Har funnet den</p>
            {[...teamFoundCodes.entries()].map(([id, found]) => {
              return <>
                <p>{id}</p>
                <p>{found}</p>
              </>
            })}
          </div>

          {team.Alias
            .sort((a, b) => b.CodeFound.length - a.CodeFound.length)
            .map(alias => {
              return <ExpandableCard title={alias.name}>
                <div className='grid grid-cols-2 text-white'>
                  {alias.CodeFound.map(code => {
                    return <>
                      <p>{code.id}</p>
                      <p>{code.code.CodesGuess.some(guess => guess.isCorrect) ? "Riktig svar" : "Funnet"}</p>
                    </>
                  })}
                </div>
              </ExpandableCard>
            })}

        </Card>
      })}

    </div>

    {codes
      .sort((a, b) => b.CodeFound.length - a.CodeFound.length)
      .map(code => {
        return <p>Oppgave {code.id}: found {code.CodeFound.length}: correct: {code.CodesGuess.filter(guess => guess.isCorrect).length}: {code.assignment}  </p>
      })
    }
  </div>

};

export default DashBoard;

