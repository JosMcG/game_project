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

export interface Game {
  id: string;
  name: string;
  description: string;
  imageURL: string;
  rules: Array<Rule>;
}

export class GameBuilder {
  private game: Game;
  constructor() {
    this.game = { rules: new Array<Rule>() } as Game;
  }
  setId(id: string): GameBuilder {
    this.game.id = id;
    return this;
  }

  setName(name: string): GameBuilder {
    this.game.name = name;
    return this;
  }

  setDescription(description: string): GameBuilder {
    this.game.description = description;
    return this;
  }

  setImageURL(imageURL: string): GameBuilder {
    this.game.imageURL = imageURL;
    return this;
  }

  addRule(title: string, value: string): GameBuilder {
    this.game.rules.push(
      new RuleBuilder()
        .setTitle(title)
        .setValue(value)
        .setOrder(this.game.rules.length)
        .buildRule()
    );
    return this;
  }

  buildGame(): Game {
    const theGame = Object.assign({}, this.game);
    this.game = {} as Game;
    return theGame;
  }
}
