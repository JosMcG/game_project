import { v4 as uuidv4 } from 'uuid';
import { ChutesAndLadders } from './chutes_and_ladders/playable_chutes_and_ladders';

export interface Rule {
  order: number;
  title?: string;
  value: string;
}

export class RuleBuilder {
  private rule: Rule;
  constructor() {
    this.rule = {} as Rule;
  }
  setOrder(order: number): RuleBuilder {
    this.rule.order = order;
    return this;
  }
  setTitle(title: string): RuleBuilder {
    this.rule.title = title.replace(/\s+/g, ' ').trim();
    return this;
  }
  setValue(value: string): RuleBuilder {
    this.rule.value = value.replace(/\s+/g, ' ').trim();
    return this;
  }
  buildRule(): Rule {
    const theRule = Object.assign({}, this.rule);
    this.rule = {} as Rule;
    return theRule;
  }
}

//export const RuleBuilder = (order: number, value: string, title?: string) => {
//  return { order: order, value: value, title: title } as Rule;
//};

export interface LiteGame {
  id: string;
  name: string;
  description: string;
  imageURL: string;
  rules: Array<Rule>;
}

export class LiteGameBuilder {
  private game: LiteGame;
  constructor() {
    this.game = { rules: new Array<Rule>() } as LiteGame;
  }
  setId(id: string): LiteGameBuilder {
    this.game.id = id;
    return this;
  }

  setName(name: string): LiteGameBuilder {
    this.game.name = name;
    return this;
  }

  setDescription(description: string): LiteGameBuilder {
    this.game.description = description;
    return this;
  }

  setImageURL(imageURL: string): LiteGameBuilder {
    this.game.imageURL = imageURL;
    return this;
  }

  addRule(title: string, value: string): LiteGameBuilder {
    this.game.rules.push(
      new RuleBuilder()
        .setTitle(title)
        .setValue(value)
        .setOrder(this.game.rules.length)
        .buildRule()
    );
    return this;
  }

  buildGame(): LiteGame {
    const theGame = Object.assign({}, this.game);
    this.game = {} as LiteGame;
    return theGame;
  }
}

export interface Game {
  gameId: string;
  playId: string;
  timeCreated: number;
  lastModTime: Date;
  instance: any;
  actions: Map<string, (() => string) | undefined>; //use a reducer to evaluate string when it comes back
}

export class GameBuilder {
  private playableGame: Game;
  constructor() {
    this.playableGame = {
      playId: uuidv4(),
      timeCreated: Math.round(Date.now() / 60000) * 60000,
      actions: new Map<string, () => string>(), //TODO look at this
    } as Game;
  }
  setGameId(id: string): GameBuilder {
    this.playableGame.gameId = id;
    return this;
  }
  setLastModTime(time: Date): GameBuilder {
    this.playableGame.lastModTime = time;
    return this;
  }
  setInstance(game: object): GameBuilder {
    this.playableGame.instance = game;
    return this;
  }
  addAction(title: string, value: string): GameBuilder {
    //TODO look at this to work with the method - is this where the reducer comes into play?
    this.playableGame.actions.set(title, this.playableGame.instance[value]);
    return this;
  }
  //Do I need to create an object with many objects or just return one game instance?
  buildPlayableGame(): Game {
    const thePlayableGame = Object.assign({}, this.playableGame);
    this.playableGame = {} as Game;
    return thePlayableGame;
  }
}

/*export interface Action {
  title: string;
  value: () => string; //use a reducer to evaluate string when it comes back
}

export class ActionBuilder {
  private action: Action;
  constructor() {
    this.action = {} as Action;
  }

  setTitle(title: string): ActionBuilder {
    this.action.title = title;
    return this;
  }
  setValue(value: () => string): ActionBuilder {
    this.action.value = value;
    return this;
  }
  buildAction(): Action {
    const theAction = Object.assign({}, this.action);
    this.action = {} as Action;
    return theAction;
  }
}

export interface PlayableGame {
  gameId: string;
  playId: string;
  timeCreated: Date;
  lastModTime: Date;
  instance: any;
  actions: Array<Action>;
}

export class PlayableGameBuilder {
  private playableGame: PlayableGame;
  constructor() {
    this.playableGame = {
      actions: new Array<Action>(),
    } as PlayableGame;
  }
  setGameId(id: string): PlayableGameBuilder {
    this.playableGame.gameId = id;
    return this;
  }
  setPlayId(): PlayableGameBuilder {
    this.playableGame.playId = uuidv4();
    return this;
  }
  setTimeCreated(): PlayableGameBuilder {
    this.playableGame.timeCreated = new Date(Date.now());
    return this;
  }
  setLastModTime(time: Date): PlayableGameBuilder {
    this.playableGame.lastModTime = time;
    return this;
  }
  setInstance(game: object): PlayableGameBuilder {
    this.playableGame.instance = game;
    return this;
  }
  /*addAction(title: string, value: () => string): PlayableGameBuilder {
    this.playableGame.actions.push(title, value);
    return this;
  }
  addAction(title: string, value: () => string): PlayableGameBuilder {
    this.playableGame.actions.push(
      new ActionBuilder().setTitle(title).setValue(value).buildAction()
    );
    return this;
  }
  buildPlayableGame(): PlayableGame {
    const thePlayableGame = Object.assign({}, this.playableGame);
    this.playableGame = {} as PlayableGame;
    return thePlayableGame;
  }
}*/
