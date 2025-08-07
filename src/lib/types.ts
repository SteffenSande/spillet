export interface User {
  name: string;
  description: string;
  team: string;
  hiddenDescription: string;
  codes: ICode[];
}

export interface ICode {
  id: number;
  externalId: string;
  hint?: string;
  assignment: string;
  length: number;
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
