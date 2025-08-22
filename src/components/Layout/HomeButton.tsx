import SvgMafiaGrandeWithoutText from "../images/MafiaGrandeWithoutText";


import React from 'react';

export interface IProps {
  gameId: number
}

const HomeButton: React.FunctionComponent<IProps> = ({ gameId }) => {
  return <>
    <a href={`/${gameId}`} className="w-16 h-16 bg-white/10 hover:bg-white/20 shadow-2xl flex flex-col justify-center items-center">
      <SvgMafiaGrandeWithoutText className="w-8 h-8" />
    </a>
  </>
};

export default HomeButton;
