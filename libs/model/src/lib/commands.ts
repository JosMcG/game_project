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

import { ChainBuilder, CommandBuilder, Context } from '@jmcguinness/chain';
import { Player } from './chutes_and_ladders/player';
import { Game } from './model';

//TODO - need to check player from req with active player!!!

export const showActionCommand = CommandBuilder.build((context: Context) => {
  const action = context.get('action') as string;
  console.log('Action: ' + action);
  return true;
});

type RequestObject = {
  player: Player;
  color: string;
};

export const verifyPlayerCommand = CommandBuilder.build((context) => {
  const req = context.get('req') as Request;
  const body = req.body as RequestObject | null;
  if (body) {
    console.log('trying to verify ' + body.player.name);
    if (body.player === context.get('activePlayer')) {
      console.log('player verified');
      return true;
    }
  }
  console.log('player not verified');
  return false;
});

export const checkPlayerNumberCommand = CommandBuilder.build(
  (context: Context) => {
    const action = context.get('action');
    const playerNum = context.get('numPlayers') as number;
    const game = context.get('game') as Game;
    if (
      action === 'registerPlayer' &&
      game.instance.players.length === playerNum
    ) {
      context.put('message', 'All players have registered.');
      return false;
    }
    return true;
  }
);

export const registerCommand = CommandBuilder.build((context: Context) => {
  const req = context.get('req') as Request;
  const body = req.body as RequestObject | null;
  const game = context.get('game') as Game;
  if (body) {
    const player = body.player;
    if (game.instance.players.includes(player.name)) {
      context.put('errorMessage', { message: 'name already in use' });
      return false;
    } else {
      game.instance.registerPlayer(player.name);
    }
  }
  return true;
});

export const rollCommand = CommandBuilder.build((context: Context) => {
  const action = context.get('action') as string;
  const game = context.get('game') as Game;
  if (game && action && action === 'takeTurn') {
    context.put('rollValue', game.instance.die.roll());
    const roll = context.get('rollValue');
    console.log('rolled a ' + roll);
  }
  return true;
});

//TODO - do not shift array
export const initialRollCommand = CommandBuilder.build((context: Context) => {
  const game = context.get('game') as Game;
  console.log(game.instance.activePlayer.name + ' is rolling');
  //TODO - decide if I want to check action for setOrder!!!
  const roll = game.instance.activePlayer.initialDiceRoll(game.instance.die);
  console.log(game.instance.activePlayer.name + ' rolled a ' + roll);
  context.put('rollValue', roll);
  //game.instance.playersToRollForOrder.shift();
  return true;
});

//TODO - change how this is handled. Do not want to remove players from array
export const checkAllInitialRollsCommand = CommandBuilder.build(
  (context: Context) => {
    const game = context.get('game') as Game;
    const activePlayer = context.get('activePlayer') as Player;
    const lastToRoll =
      game.instance.playersToRollForOrder[
        game.instance.playersToRollForOrder.length - 1
      ];
    if (activePlayer === lastToRoll) {
      console.log('everyone has rolled');
      context.put('action', 'checkForRerolls');
      return true;
    } else {
      console.log('update the player - do not check for rerolls yet');
      context.put('action', 'updatePlayer');
    }
    return true;
  }
);

export const checkForRerolls = CommandBuilder.build((context: Context) => {
  const action = context.get('action') as string;
  console.log('action: ' + action);
  if (action === 'checkForRerolls') {
    const game = context.get('game') as Game;
    const unique = new Set();
    const rollAgain = new Set();
    let checkRoll = 0;

    for (let p = 0; p < game.instance.playersToRollForOrder.length; p++) {
      checkRoll =
        game.instance.playersToRollForOrder[p].initialRoll[
          game.instance.playersToRollForOrder[p].initialRoll.length - 1
        ];
      if (unique.has(checkRoll)) {
        const match = game.instance.playersToRollForOrder.filter(
          (p: Player) => p.initialRoll[p.initialRoll.length - 1] === checkRoll
        );
        if (match[0].initialRoll.length >= 2) {
          for (let n = 0; n < match.length; n++) {
            const stillRolling = match.filter(
              (p: Player) =>
                p.initialRoll[p.initialRoll.length - 2] ===
                match[n].initialRoll[match[n].initialRoll.length - 2]
            );
            if (stillRolling.length > 1) {
              stillRolling.forEach((p: Player) => rollAgain.add(p));
            }
          }
        } else {
          match.forEach((p: Player) => rollAgain.add(p));
        }
      }
      unique.add(checkRoll);
    }
    game.instance.playersToRollForOrder = Array.from(rollAgain);
    console.log(
      'number of players to roll again: ' +
        game.instance.playersToRollForOrder.length
    );
    console.log('roll for order is now: ' + new Array(...rollAgain).join(' '));
    if (game.instance.playersToRollForOrder.length >= 2) {
      context.put('action', 'updatePlayerForReroll');
    } else {
      context.put('action', 'setOrder');
    }
  }
  return true;
});

export const chooseAvatarCommand = CommandBuilder.build((context: Context) => {
  const game = context.get('game') as Game;
  const player = context.get('activePlayer') as Player;
  const req = context.get('req') as Request;
  const body = req.body as RequestObject | null; //TODO - check type; it wouldn't allow type Avatar to be used
  console.log(game.instance.activePlayer.name + ' is choosing an avatar');
  if (body) {
    game.instance.setAvatar(player, body.color);
    console.log(
      game.instance.activePlayer.name + ' chose a color: ' + body.color
    );
    return true;
  }
  return false;
});

export const updateUnorderedActivePlayerCommand = CommandBuilder.build(
  (context: Context) => {
    const action = context.get('action') as string;
    const game = context.get('game') as Game;
    if (action === 'updatePlayer') {
      //update to next player in the array before order has been set
      const index = game.instance.playersToRollForOrder.indexOf(
        context.get('activePlayer') as Player
      );
      const nextPlayer = game.instance.playersToRollForOrder[index + 1];
      console.log('going to next player, ' + nextPlayer.name + ', to roll');
      game.instance.activePlayer = nextPlayer;
      context.put('activePlayer', nextPlayer);
    } else if (action === 'updatePlayerForReroll') {
      game.instance.activePlayer = game.instance.playersToRollForOrder[0];
      context.put('activePlayer', game.instance.playersToRollForOrder[0]);
    }
    return true;
  }
);

export const updateOrderedActivePlayerCommand = CommandBuilder.build(
  (context: Context) => {
    const game = context.get('game') as Game;
    //update to next player after order has been set
    for (let i = 0; i < game.instance.players.length; i++) {
      console.log('Player: ' + game.instance.players[i].name);
    }
    console.log(
      'active player is ' +
        game.instance.activePlayer.name +
        ' and next player is ' +
        game.instance.activePlayer.next.name
    );
    game.instance.activePlayer = game.instance.activePlayer.next;
    context.put('activePlayer', game.instance.activePlayer);
    const next = context.get('activePlayer') as Player;
    console.log(next.name + ' is now the active player');
    return true;
  }
);

export const setOrderCommand = CommandBuilder.build((context: Context) => {
  const action = context.get('action') as string;
  const game = context.get('game') as Game;
  if (action === 'setOrder') {
    console.log('setting order');
    game.instance.setUpGame();
    context.put('activePlayer', game.instance.firstPlayer);
  }
  return true;
});

export const moveCommand = CommandBuilder.build((context: Context) => {
  const game = context.get('game') as Game;
  const num = context.get('rollValue');
  game.instance.activePlayer.avatar.move(num);
  console.log(
    game.instance.activePlayer.name +
      ' is on space ' +
      game.instance.activePlayer.avatar.location.value
  );
  return true;
});

export const paintBoardCommand = CommandBuilder.build((context: Context) => {
  const game = context.get('game') as Game;
  context.put('boardInfo', game.instance.getInfoToDisplayBoard());
  return true;
});

export const registrationChain = ChainBuilder.build(true, [
  checkPlayerNumberCommand,
  registerCommand,
  paintBoardCommand,
]);

export const setOrderChain = ChainBuilder.build(true, [
  verifyPlayerCommand,
  initialRollCommand,
  checkAllInitialRollsCommand,
  checkForRerolls,
  setOrderCommand,
  updateUnorderedActivePlayerCommand,
  paintBoardCommand,
]);

export const chooseAvatarChain = ChainBuilder.build(true, [
  verifyPlayerCommand,
  chooseAvatarCommand,
  updateOrderedActivePlayerCommand,
  paintBoardCommand,
]);

export const takeTurnChain = ChainBuilder.build(true, [
  verifyPlayerCommand,
  rollCommand,
  moveCommand,
  updateOrderedActivePlayerCommand,
  paintBoardCommand,
]);

export const connectorChain = ChainBuilder.build(true, [
  registrationChain,
  setOrderChain,
  chooseAvatarChain,
  takeTurnChain,
]);
// CommandBuilder.build((context: Context) => {
//   if(context.get('action') && context.getString('action') === 'registerPlayer') {
//     const {req, game} = getCargoFromContext(context)
//     const player = req.body as Player

//   console.log('Action: ${action}')
//   return true;
// }),
