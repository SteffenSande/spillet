export interface User {
  name: string;
  description: string;
  team: string;
  hiddenDescription: string;
  codes: Code[];
}

export interface Code {
  externalId?: String;
  hint?: String;
  assignment?: String;
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
