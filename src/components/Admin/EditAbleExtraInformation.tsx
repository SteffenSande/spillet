import { Label } from '@radix-ui/react-label';
import React from 'react';
import { Textarea } from '../ui/textarea';
import { actions } from 'astro:actions';
import { FaAngleUp, FaPlus, FaRemoveFormat } from 'react-icons/fa';

export interface IProps {
  gameId: number,
  extraInformation: {
    id?: number,
    text: string
  }
}

const EditAbleExtraInformation: React.FunctionComponent<IProps> = ({ gameId, extraInformation }) => {
  const [extraInfo, setExtraInfo] = React.useState(extraInformation.text);
  return <>
    <span className='w-full'>
      <Label htmlFor="extraInformation">Legg til informasjon:</Label>
      <Textarea id="extraInformation" placeholder='Skriv extra informasjon inn her.' value={extraInfo} onChange={(e) => {
        setExtraInfo(e.target.value)
      }}></Textarea>
    </span>
    {extraInformation.id ? <span className='grid gap-4'>
      <button className="destructive flex h-8 grow-0 justify-between items-center gap-4" onClick={async () => {
        await actions.game.delete({
          id: extraInformation.id!,
        })
        window.location.reload();
      }}>Fjern <FaRemoveFormat /></button>
      <button className="flex h-8 grow-0 justify-between items-center gap-4" onClick={async () => {
        await actions.game.update({
          id: extraInformation.id!,
          extraInformation: extraInfo
        })
        window.location.reload();
      }}>Oppdater <FaAngleUp /></button>
    </span>
      : <button className="flex grow-0 h-8 justify-between items-center gap-4" onClick={async () => {
        await actions.game.add({
          gameId: gameId,
          extraInformation: extraInfo
        })
        window.location.reload();
      }}>Legg til <FaPlus></FaPlus></button>
    }
  </>
};

export default EditAbleExtraInformation;

