export interface Game {
  intro: string;
  rules: string;
  extraInformation: string[];
}

export interface User {
  name: string;
  description: string;
  team: string;
  hiddenDescription: string;
  codes: ICodeOverview[];
}

export interface ICode {
  id: number;
  externalId: string;
  hint?: string;
  assignment: string;
  imagePath?: string;
  length: number;
}

export interface ICodeOverview {
  externalId?: string;
  hint?: string;
  assignment?: string;
}

export interface IFinalQuestion {
  externalId: string;
  assignment: string;
  codeLength: number;
}

export interface PublicUser {
  id: number;
  name: string;
  description: string;
  alreadyVotedFor: boolean;
  isAlive: boolean;
}
export interface Team {
  id: number;
  name: string;
}
export interface Votes {
  max: number;
  used: number;
  canVote: boolean;
}

export type ServerAction = KillCommand | Hint;

export interface KillCommand {
  type: "kill";
}
export interface Hint {
  type: "hint";
  message: string;
}
