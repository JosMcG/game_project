// Copyright 2024 Josilyn McGuinness
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

//import { Context } from '@jmcguinness/chain';
import { ContextBuilder, Context } from '@jmcguinness/base';
import { Game } from './model';
import { playChutesAndLadders } from './game_objects';
import {
  checkAllInitialRollsCommand,
  checkForRerolls,
  checkPlayerNumberCommand,
  chooseAvatarChain,
  chooseAvatarCommand,
  initialRollCommand,
  moveCommand,
  registerCommand,
  registrationChain,
  rollCommand,
  setOrderChain,
  setOrderCommand,
  takeTurnChain,
  updateOrderedActivePlayerCommand,
  updateUnorderedActivePlayerCommand,
  verifyPlayerCommand,
} from './commands';
import { Player } from './chutes_and_ladders/player';
import { Avatar } from './chutes_and_ladders/avatar';

const testContext = () => {
  const game = playChutesAndLadders;
  const ctx = ContextBuilder.build();
  const p4 = new Player('Fred');
  ctx.put('player', p4);
  ctx.put('game', game);
  ctx.put('action', 'register');
  ctx.put('req', { body: { player: p4, color: 'blue' } });
  return ctx;
};

let ctx: Context;
let game: Game;

beforeEach(() => {
  ctx = testContext();
  game = ctx.get('game') as Game;
  const p1 = new Player('Wilma');
  const p2 = new Player('Shaggy');
  const p3 = new Player('Scooby');
  game.instance.players = [p1, p2, p3];
  game.instance.playersToRollForOrder = [p1, p2, p3];
});

describe('test single registration command', () => {
  it('should have one player registered', () => {
    ctx.put('action', 'registerPlayer');
    registerCommand.execute(ctx);
    expect(game.instance.players.length).toBe(4);
  });
});
describe('test the check player number command', () => {
  it('should not allow a player to be registered', () => {
    ctx.put('playerNum', 3);
    ctx.put('action', 'registerPlayer');
    game.instance.players = ['Wilma', 'Shaggy', 'Fred'];
    checkPlayerNumberCommand.execute(ctx);
    console.log('Number of players: ' + game.instance.players.length);
    expect(game.instance.players.length).toBe(3);
  });
});

describe('test registration chain', () => {
  it('should have one player registered and return a board', () => {
    ctx.put('action', 'registerPlayer');
    registrationChain.execute(ctx);
    const board = ctx.get('boardInfo') as Array<object>;
    expect(board).toBeTruthy();
    expect(board.length).toBe(100);
  });

  it('should have three players registered and return a board', () => {
    ctx.put('action', 'registerPlayer');
    ctx.put('playerNum', 3);
    game.instance.players = ['Wilma', 'Shaggy'];
    registrationChain.execute(ctx);
    const board = ctx.get('boardInfo') as Array<object>;
    expect(game.instance.players.length).toBe(3);
    expect(board).toBeTruthy();
    expect(board.length).toBe(100);
  });

  it('should stop chain and return a message if all players are already registered', () => {
    ctx.put('action', 'registerPlayer');
    ctx.put('numPlayers', 3);
    game.instance.players = ['Wilma', 'Shaggy', 'Fred'];
    registrationChain.execute(ctx);
    const message = ctx.get('message') as string;
    expect(message).toMatch('All players have registered.');
  });
});

//TODO - figure out what to test for, as values are determined and changed each time.
describe('test set order chain', () => {
  it('should have Scooby as the active player and the first in players array', () => {
    let active = game.instance.playersToRollForOrder[0];
    game.instance.activePlayer = active;
    ctx.put('activePlayer', active);
    ctx.put('req', { body: { player: active, color: 'blue' } });
    while (game.instance.playersToRollForOrder.length >= 1) {
      active = ctx.get('activePlayer');
      ctx.put('req', { body: { player: active, color: 'blue' } });
      setOrderChain.execute(ctx);
    }
  });
});

describe('test single initial roll command', () => {
  it('should have a 1-6 number for rollValue', () => {
    game.instance.activePlayer = new Player('Scooby');
    initialRollCommand.execute(ctx);
    expect(ctx.get('rollValue')).toBeLessThanOrEqual(6);
    expect(ctx.get('rollValue')).toBeGreaterThan(0);
  });
});

describe('test check all initial rolls command', () => {
  it('should set context action to checkForRerolls if all have rolled', () => {
    let n = 1;
    game.instance.players.forEach((p: Player) => {
      p.initialRoll.push(n++);
    });
    ctx.put('activePlayer', game.instance.players[2]);
    checkAllInitialRollsCommand.execute(ctx);
    expect(ctx.get('action')).toBe('checkForRerolls');
  });

  it('should set context action to updatePlayer if players still need to roll', () => {
    ctx.put('activePlayer', game.instance.playersToRollForOrder[0]);
    game.instance.playersToRollForOrder[0].initialRoll.push(3);
    checkAllInitialRollsCommand.execute(ctx);
    expect(ctx.get('action')).toBe('updatePlayer');
  });
});

it('should set context action to updatePlayer if not all have rolled', () => {
  let n = 1;
  game.instance.players.forEach((p: Player) => {
    if (p.name != 'Scooby') {
      p.initialRoll.push(n++);
    }
  });
  checkAllInitialRollsCommand.execute(ctx);
  expect(ctx.get('action')).toBe('updatePlayer');
});

describe('test update unordered active player', () => {
  it('should change the active player to the next in playersToRollForOder array before the order has been set', () => {
    ctx.put('action', 'updatePlayer');
    ctx.put('activePlayer', game.instance.playersToRollForOrder[0]);
    game.instance.activePlayer = game.instance.playersToRollForOrder[0];
    updateUnorderedActivePlayerCommand.execute(ctx);
    const player = ctx.get('activePlayer') as Player;
    expect(player.name).toBe('Shaggy');
  });
});

describe('test check for rerolls command', () => {
  it('should result in playersToRollForOrder array having a length of 2', () => {
    ctx.put('action', 'checkForRerolls');
    game.instance.players[0].initialRoll = [2];
    game.instance.players[1].initialRoll = [2];
    game.instance.players[2].initialRoll = [3];
    checkForRerolls.execute(ctx);
    expect(game.instance.playersToRollForOrder.length).toBe(2);
    expect(ctx.get('action')).toBe('updatePlayerForReroll');
  });

  it('should result in playersToRollForOrder array having a length of 0', () => {
    ctx.put('action', 'checkForRerolls');
    game.instance.players[0].initialRoll = [2, 1];
    game.instance.players[1].initialRoll = [2, 5];
    game.instance.players[2].initialRoll = [3];
    checkForRerolls.execute(ctx);
    expect(game.instance.playersToRollForOrder.length).toBe(0);
    expect(ctx.get('action')).toBe('setOrder');
  });

  it('should result in playersToRollForOrder array having a length of 0', () => {
    ctx.put('action', 'checkForRerolls');
    game.instance.players[0].initialRoll = [2];
    game.instance.players[1].initialRoll = [4];
    game.instance.players[2].initialRoll = [5];
    console.log();
    checkForRerolls.execute(ctx);
    expect(game.instance.playersToRollForOrder.length).toBe(0);
    expect(ctx.get('action')).toBe('setOrder');
  });
});

describe('test set order command', () => {
  it('should set the active player to the player with the highest roll - Wilma', () => {
    ctx.put('action', 'setOrder');
    game.instance.players[0].initialRoll = [5, 4];
    game.instance.players[1].initialRoll = [2];
    game.instance.players[2].initialRoll = [5, 1];
    setOrderCommand.execute(ctx);
    const player = ctx.get('activePlayer') as Player;
    expect(player.name).toBe('Wilma');
  });

  it('should set the active player to the player with the highest roll - Scooby', () => {
    ctx.put('action', 'setOrder');
    game.instance.players[0].initialRoll = [3, 4];
    game.instance.players[1].initialRoll = [3, 2];
    game.instance.players[2].initialRoll = [5];
    setOrderCommand.execute(ctx);
    const player = ctx.get('activePlayer') as Player;
    expect(player.name).toBe('Scooby');
  });
});

describe('test single roll command', () => {
  it('should have a 1-6 number for rollValue', () => {
    ctx.put('action', 'takeTurn');
    rollCommand.execute(ctx);
    expect(ctx.get('rollValue')).toBeLessThanOrEqual(6);
    expect(ctx.get('rollValue')).toBeGreaterThan(0);
  });
});

describe('test move command', () => {
  it('should move the avatar a certain number of spaces', () => {
    game.instance.activePlayer = new Player('Scooby');
    game.instance.activePlayer.avatar = new Avatar('green');
    game.instance.activePlayer.avatar.location = game.instance.startSpace;
    ctx.put('rollValue', 5);
    moveCommand.execute(ctx);
    expect(game.instance.activePlayer.avatar.location.value).toBe('6');
  });
});

describe('test update ordered active player', () => {
  it('should change the active player to the next in linked list after order has been set', () => {
    game.instance.players[0].next = game.instance.players[1];
    game.instance.players[1].next = game.instance.players[2];
    game.instance.players[2].next = game.instance.players[3];
    ctx.put('activePlayer', game.instance.players[0]);
    game.instance.activePlayer = game.instance.players[0];
    updateOrderedActivePlayerCommand.execute(ctx);
    const player = ctx.get('activePlayer') as Player;
    expect(player.name).toBe('Shaggy');
  });
});

describe('test verify player command', () => {
  it('should return true if the request player is the active player', () => {
    const p = ctx.get('player') as Player;
    ctx.put('activePlayer', p);
    const status = verifyPlayerCommand.execute(ctx);
    expect(status).toBeTruthy();
  });

  it('should return false if the request player is not the active player', () => {
    ctx.put('activePlayer', new Player('Velma'));
    const status = verifyPlayerCommand.execute(ctx);
    expect(status).toBeFalsy();
  });
});

describe('test choose avatar command', () => {
  it('should assign chosen avatar to the player', () => {
    game.instance.availableAvatars = [
      'red',
      'yellow',
      'green',
      'blue',
      'purple',
    ];
    const p = new Player('Fred');
    game.instance.players[1] = p;
    ctx.put('activePlayer', p);
    game.instance.activePlayer = p;
    chooseAvatarCommand.execute(ctx);
    expect(game).toBeTruthy();
    expect(game.instance).toBeTruthy();
    expect(game.instance.players[1].avatar).toBeTruthy();
    expect(game.instance.players[1].avatar.color).toBe('blue');
  });
});

describe('test choose avatar chain', () => {
  it("should set Wilma's avatar to green", () => {
    game.instance.availableAvatars = [
      'red',
      'yellow',
      'green',
      'blue',
      'purple',
    ];
    game.instance.players[0].next = game.instance.players[1];
    game.instance.players[1].next = game.instance.players[2];
    game.instance.players[2].next = game.instance.players[0];
    const player = game.instance.players[0];
    ctx.put('activePlayer', player);
    game.instance.activePlayer = player;
    ctx.put('req', { body: { player: player, color: 'green' } });
    chooseAvatarChain.execute(ctx);
    expect(game.instance).toBeTruthy();
    expect(game.instance.players[0].name).toBe('Wilma');
    expect(game.instance.players[0].avatar.color).toBe('green');
    const next = ctx.get('activePlayer') as Player;
    expect(next.name).toBe('Shaggy');
  });
});

describe('test take turn chain', () => {
  it("should update the location of Wilma's avatar", () => {
    const player = game.instance.players[0];
    player.avatar = new Avatar('green');
    player.avatar.location = game.instance.startSpace;
    game.instance.startSpace.avatars = [player.avatar];
    game.instance.players[0].next = game.instance.players[1];
    game.instance.players[1].next = game.instance.players[2];
    game.instance.players[2].next = game.instance.players[0];
    ctx.put('action', 'takeTurn');
    ctx.put('activePlayer', player);
    game.instance.activePlayer = player;
    ctx.put('req', { body: { player: player, color: 'green' } });
    takeTurnChain.execute(ctx);
    expect(player.avatar.location.value).not.toBe('1');
  });
});
