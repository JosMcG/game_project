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
import { ContextVariables, Game, RequestMessage } from './model';
import { Request, Response } from 'express';

export const showActionCommand = CommandBuilder.build((context: Context) => {
  const action = context.get(ContextVariables.ACTION.toString()) as string;
  console.log('Action: ' + action);
  return true;
});

export const verifyPlayerCommand = CommandBuilder.build((context) => {
  const req = context.get(ContextVariables.REQUEST.toString()) as Request;
  const body = req.body as RequestMessage | null; //TODO - change this to check for null and respond with 403 or 404
  if (body) {
    //console.log('trying to verify ' + body.player.name);
    if (body.player.player === context.get('activePlayer')) {
      //console.log('player verified');
      return true;
    }
  }
  console.log('player not verified');
  return false;
});

export const checkPlayerNumberCommand = CommandBuilder.build(
  (context: Context) => {
    const action = context.get(ContextVariables.ACTION.toString());
    const req = context.get(ContextVariables.REQUEST.toString()) as Request;
    const body = req.body as RequestMessage;
    //console.log('the action is: ' + action);
    const game = context.get(ContextVariables.GAME.toString()) as Game;
    if (game.playerNum) {
      console.log('number of players set to ' + game.playerNum);
    }
    if (game.instance.players.length === 0) {
      game.playerNum = body.numPlayers;
      console.log('just set number of players to ' + game.playerNum);
      game.gameRoom = body.room;
      return true;
    }
    if (game.instance.players.length == game.playerNum) {
      console.log('players are full');
      context.put('errorMessage', 'All players have registered.');
      return false;
    }
    return true;
  }
);

export const registerCommand = CommandBuilder.build((context: Context) => {
  console.log('In registration command');
  const req = context.get(ContextVariables.REQUEST.toString()) as Request;
  const body = req.body as RequestMessage;
  const game = context.get(ContextVariables.GAME.toString()) as Game;
  if (body) {
    const name = body.player;
    if (game.instance.players.includes(name)) {
      context.put('errorMessage', { message: 'name already in use' });
      return false;
    } else {
      const player = game.instance.registerPlayer(name);
      context.put(ContextVariables.PLAYER.toString(), {
        playerName: player.name,
        playerId: player.id,
      });
    }
  }
  return true;
});

export const rollCommand = CommandBuilder.build((context: Context) => {
  const action = context.get(ContextVariables.ACTION.toString()) as string;
  const game = context.get(ContextVariables.GAME.toString()) as Game;
  if (game && action && action === 'takeTurn') {
    context.put('rollValue', game.instance.die.roll());
    const roll = context.get('rollValue');
    //console.log('rolled a ' + roll);
  }
  return true;
});

export const initialRollCommand = CommandBuilder.build((context: Context) => {
  const game = context.get(ContextVariables.GAME.toString()) as Game;
  //console.log(game.instance.activePlayer.name + ' is rolling');
  //TODO - decide if I want to check action for setOrder!!!
  const roll = game.instance.activePlayer.initialDiceRoll(game.instance.die);
  //console.log(game.instance.activePlayer.name + ' rolled a ' + roll);
  context.put('rollValue', roll);
  return true;
});

export const checkAllInitialRollsCommand = CommandBuilder.build(
  (context: Context) => {
    const game = context.get(ContextVariables.GAME.toString()) as Game;
    const activePlayer = context.get('activePlayer') as Player;
    const lastToRoll =
      game.instance.playersToRollForOrder[
        game.instance.playersToRollForOrder.length - 1
      ];
    if (activePlayer === lastToRoll) {
      //console.log('everyone has rolled');
      context.put(ContextVariables.ACTION.toString(), 'checkForRerolls');
      return true;
    } else {
      //console.log('update the player - do not check for rerolls yet');
      context.put(ContextVariables.ACTION.toString(), 'updatePlayer');
    }
    return true;
  }
);

export const checkForRerolls = CommandBuilder.build((context: Context) => {
  const action = context.get(ContextVariables.ACTION.toString()) as string;
  //console.log('action: ' + action);
  if (action === 'checkForRerolls') {
    const game = context.get(ContextVariables.GAME.toString()) as Game;
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
    // console.log(
    //   'number of players to roll again: ' +
    //     game.instance.playersToRollForOrder.length
    // );
    //console.log('roll for order is now: ' + new Array(...rollAgain).join(' '));
    if (game.instance.playersToRollForOrder.length >= 2) {
      context.put(ContextVariables.ACTION.toString(), 'updatePlayerForReroll');
    } else {
      context.put(ContextVariables.ACTION.toString(), 'setOrder');
    }
  }
  return true;
});

export const chooseAvatarCommand = CommandBuilder.build((context: Context) => {
  const game = context.get(ContextVariables.GAME.toString()) as Game;
  const player = context.get('activePlayer') as Player;
  const req = context.get(ContextVariables.REQUEST.toString()) as Request;
  //console.log('From request: ' + req.body.color);
  const body = req.body as RequestMessage | null;
  //console.log(game.instance.activePlayer.name + ' is choosing an avatar');
  if (body) {
    game.instance.setAvatar(player, body.color);
    // console.log(
    //   game.instance.activePlayer.name + ' chose a color: ' + body.color
    // );
    return true;
  }
  return false;
});

export const updateUnorderedActivePlayerCommand = CommandBuilder.build(
  (context: Context) => {
    const action = context.get(ContextVariables.ACTION.toString());
    const game = context.get(ContextVariables.GAME.toString()) as Game;
    if (action === 'updatePlayer') {
      //update to next player in the array before order has been set
      const index = game.instance.playersToRollForOrder.indexOf(
        context.get('activePlayer') as Player
      );
      const nextPlayer = game.instance.playersToRollForOrder[index + 1];
      //console.log('going to next player, ' + nextPlayer.name + ', to roll');
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
    const game = context.get(ContextVariables.GAME.toString()) as Game;
    //update to next player after order has been set
    // for (let i = 0; i < game.instance.players.length; i++) {
    //   console.log('Player: ' + game.instance.players[i].name);
    // }
    // console.log(
    //   'active player is ' +
    //     game.instance.activePlayer.name +
    //     ' and next player is ' +
    //     game.instance.activePlayer.next.name
    // );
    game.instance.activePlayer = game.instance.activePlayer.next;
    context.put('activePlayer', game.instance.activePlayer);
    const next = context.get('activePlayer') as Player;
    //console.log(next.name + ' is now the active player');
    return true;
  }
);

export const setOrderCommand = CommandBuilder.build((context: Context) => {
  const action = context.get(ContextVariables.ACTION.toString()) as string;
  const game = context.get(ContextVariables.GAME.toString()) as Game;
  if (action === 'setOrder') {
    //console.log('setting order');
    game.instance.setUpGame();
    context.put('activePlayer', game.instance.firstPlayer);
  }
  return true;
});

export const moveCommand = CommandBuilder.build((context: Context) => {
  const game = context.get(ContextVariables.GAME.toString()) as Game;
  const num = context.get('rollValue');
  game.instance.activePlayer.avatar.move(num);
  // console.log(
  //   game.instance.activePlayer.name +
  //     ' is on space ' +
  //     game.instance.activePlayer.avatar.location.value
  // );
  return true;
});

//TODO - write response here - write JSON object
export const paintBoardCommand = CommandBuilder.build((context: Context) => {
  const game = context.get(ContextVariables.GAME.toString()) as Game;
  const resp = context.get(ContextVariables.RESPONSE.toString()) as Response;
  const player = context.get(ContextVariables.PLAYER.toString())
    ? (context.get(ContextVariables.PLAYER.toString()) as Player)
    : null;
  const players = game.instance.players.map((p: Player) => p.name);
  const roll = context.get('rollValue');
  let activePlayer = {};
  let waiting = true;
  //let ready = false;
  if (game.instance.players.length == game.playerNum) {
    //TODO - change playerNum to a number
    waiting = false;
  }

  if (game.instance.activePlayer) {
    activePlayer = {
      playerName: game.instance.activePlayer.name,
      playerId: game.instance.activePlayer.id,
    };
    console.log(game.instance.activePlayer.name + ' is the active player');
  }
  //console.log('looking at registered player: ' + players[0]);
  resp.json({
    playId: game.playId,
    gameId: game.gameId,
    room: game.gameRoom,
    playerNum: game.playerNum,
    players: players,
    player: player, //Do I want to send player back or just active player to check against UI player??
    spaces: game.instance.getInfoToDisplayBoard(),
    waitingForPlayers: waiting,
    activePlayer: activePlayer,
    roll: roll,
  });
  return true;
});

export const refreshChain = ChainBuilder.build(false, [paintBoardCommand]);

export const registrationChain = ChainBuilder.build(false, [
  checkPlayerNumberCommand,
  registerCommand,
  paintBoardCommand,
]);

export const setOrderChain = ChainBuilder.build(false, [
  verifyPlayerCommand,
  initialRollCommand,
  checkAllInitialRollsCommand,
  checkForRerolls,
  setOrderCommand,
  updateUnorderedActivePlayerCommand,
  paintBoardCommand,
]);

export const chooseAvatarChain = ChainBuilder.build(false, [
  verifyPlayerCommand,
  chooseAvatarCommand,
  updateOrderedActivePlayerCommand,
  paintBoardCommand,
]);

export const takeTurnChain = ChainBuilder.build(false, [
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
