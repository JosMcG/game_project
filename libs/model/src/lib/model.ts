import { v4 as uuidv4 } from 'uuid';
import { ChutesAndLadders } from './chutes_and_ladders/playable_chutes_and_ladders';
import { Command, Context } from '@jmcguinness/chain';

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
  action: Command;
}

export class GameBuilder {
  private playableGame: Game;
  constructor() {
    this.playableGame = {
      playId: uuidv4(),
      timeCreated: Math.round(Date.now() / 60000) * 60000,
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
  addAction(chain: Command) {
    this.playableGame.action = chain;
    return this;
  }
  buildPlayableGame(): Game {
    const playableGame = Object.assign({}, this.playableGame);
    this.playableGame = {} as Game;
    return playableGame;
  }
}
