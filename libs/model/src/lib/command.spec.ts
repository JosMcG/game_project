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
import { ChainBuilder, ContextBuilder } from '@jmcguinness/base';
import { Game } from './model';
import { playChutesAndLadders } from './game_objects';
import {
  checkAllInitialRollsCommand,
  checkPlayerNumberCommand,
  initialRollCommand,
  paintBoardCommand,
  registerCommand,
  setOrderCommand,
  updateActivePlayerCommand,
  verifyPlayerCommand,
} from './commands';

const registrationChain = ChainBuilder.build(true, [
  checkPlayerNumberCommand,
  registerCommand,
  paintBoardCommand,
]);

const testContext = () => {
  const game = playChutesAndLadders;
  const ctx = ContextBuilder.build();
  ctx.put('game', game);
  ctx.put('action', 'register');
  ctx.put('req', { body: { player: 'Fred' } });
  return ctx;
};

describe('test single registration command', () => {
  it('should have one player registered', () => {
    const ctx = testContext();
    ctx.put('playerNum', 0);
    ctx.put('action', 'registerPlayer');
    const game = ctx.get('game') as Game;
    registerCommand.execute(ctx);
    expect(game.instance.players.length).toBe(1);
  });
});
describe('test the check player number command', () => {
  it('should not allow a player to be registered', () => {
    const ctx = testContext();
    ctx.put('playerNum', 3);
    ctx.put('action', 'registerPlayer');
    const game = ctx.get('game') as Game;
    game.instance.players = ['Wilma', 'Shaggy', 'Fred'];
    checkPlayerNumberCommand.execute(ctx);
    console.log('Number of players: ' + game.instance.players.length);
    expect(game.instance.players.length).toBe(3);
  });
});

describe('test registration chain', () => {
  it('should have one player registered and return a board', () => {
    const ctx = testContext();
    ctx.put('action', 'registerPlayer');
    registrationChain.execute(ctx);
    const board = ctx.get('boardInfo') as Array<object>;
    expect(board).toBeTruthy();
    expect(board.length).toBe(100);
  });

  it('should have three players registered and return a board', () => {
    const ctx = testContext();
    ctx.put('action', 'registerPlayer');
    ctx.put('playerNum', 3);
    const game = ctx.get('game') as Game;
    game.instance.players = ['Wilma', 'Shaggy'];
    registrationChain.execute(ctx);
    const board = ctx.get('boardInfo') as Array<object>;
    expect(game.instance.players.length).toBe(3);
    expect(board).toBeTruthy();
    expect(board.length).toBe(100);
  });

  it('should stop chain and return a message if all players are already registered', () => {
    const ctx = testContext();
    ctx.put('action', 'registerPlayer');
    ctx.put('numPlayers', 3);
    const game = ctx.get('game') as Game;
    game.instance.players = ['Wilma', 'Shaggy', 'Fred'];
    registrationChain.execute(ctx);
    const message = ctx.get('message') as string;
    expect(message).toMatch('All players have registered.');
  });
});

const setOrderChain = ChainBuilder.build(true, [
  verifyPlayerCommand,
  initialRollCommand,
  checkAllInitialRollsCommand,
  updateActivePlayerCommand,
  setOrderCommand,
  paintBoardCommand,
]);

describe('test single initial roll command', () => {
  it('should have a 1-6 number for rollValue', () => {
    const ctx = testContext();
    initialRollCommand.execute(ctx);
    expect(ctx.get('rollValue')).toBeLessThanOrEqual(6);
    expect(ctx.get('rollValue')).toBeGreaterThan(0);
  });
});

describe('test set order chain', () => {
  it('should determine the order of the players and set the first player to activePlayer', () => {
    const ctx = testContext();
    ctx.put('activePlayer', 'Fred');
    const game = ctx.get('game') as Game;
    game.instance.registerPlayer('Scooby');
    game.instance.registerPlayer('Shaggy');
    game.instance.registerPlayer('Wilma');
    game.instance.registerPlayer('Fred');
    for (let p = 0; p < 3; p++) {
      game.instance.players[p].initialRoll = game.instance.die.roll();
    }
    ctx.put('action', 'setOrder');
  });
});
