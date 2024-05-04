export type Context = {
  state: Map<string, unknown>;
  put: (key: string, value: unknown) => void;
  get: (key: string) => unknown;
  getString: (key: string) => string;
  getNumber: (key: string) => number;
};

/*Command has a function that takes
 a Context and returns a boolean*/
export interface Command {
  execute: (context: Context) => boolean;
}

/*Chain has a function that takes a 
Context and returns a boolean (Command) 
and a function that returns an array of Commands*/
export interface Chain extends Command {
  getCommands(): Array<Command>;
}
