import React from 'react';
import { Toaster } from "react-hot-toast"

export interface IProps {
}

const HintToast: React.FunctionComponent<IProps> = () => {
  return <>
    <Toaster
      position="bottom-center"
      gutter={8}
    />
  </>
};

export default HintToast;

