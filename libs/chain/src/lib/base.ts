import { Context, Command, Chain } from './chain';

class BaseContext implements Context {
  state: Map<string, unknown>;
  constructor() {
    this.state = new Map<string, unknown>();
  }
  put(key: string, value: unknown) {
    this.state.set(key, value);
  }
  get(key: string): unknown {
    //ASK - why does this return an unknown
    return this.state.get(key);
  }
  getString(key: string): string {
    //ASK about the purpose of this - it looks like it returns the given parameter
    return this.get(key) as string;
  }
  getNumber(key: string): number {
    return this.get(key) as number;
  }
}

export class ContextBuilder {
  static build(): Context {
    return new BaseContext() as Context;
  }
}

//ASK - what is the executor
class BaseCommand implements Command {
  executor: (context: Context) => boolean;
  constructor(executor: (context: Context) => boolean) {
    this.executor = executor;
  }
  execute(context: Context): boolean {
    return this.executor(context);
  }
}

export class CommandBuilder {
  static build(executor: (context: Context) => boolean): Command {
    return new BaseCommand(executor) as Command;
  }
}

//ASK - why doesn't the Chain interface have commands and continueOnError
class BaseChain implements Chain {
  commands: Array<Command>;
  continueOnError: boolean;
  constructor(commands: Array<Command>, continueOnError: boolean) {
    this.commands = commands.slice(); //gives a shallow copy of commands array
    this.continueOnError = continueOnError;
  }
  execute(context: Context) {
    for (const command of this.commands) {
      const ans = command.execute(context);
      if (!this.continueOnError && !ans) {
        return ans;
      }
    }
    return true;
  }
  getCommands(): Array<Command> {
    return this.commands;
  }
}

export class ChainBuilder {
  static build(continueOnError: boolean, commands: Command[]): Chain {
    return new BaseChain([...commands], continueOnError) as Chain;
  }
}
