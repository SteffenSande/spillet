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
