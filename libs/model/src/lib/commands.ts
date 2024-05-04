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

import { CommandBuilder, Context } from '@jmcguinness/chain';
import { Player } from './chutes_and_ladders/player';
import { Game } from './model';

//TODO - need to check player from req with active player!!!

export const showActionCommand = CommandBuilder.build((context: Context) => {
  const action = context.get('action') as string;
  console.log('Action: ' + action);
  return true;
});

export const verifyPlayerCommand = CommandBuilder.build((context) => {
  const req = context.get('req') as Request;
  const player = req.body as unknown;
  if (!(player === context.get('activePlayer'))) {
    return false;
  }
  return true;
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
  const name = req.body as unknown;
  console.log('name to register: ' + name);
  const game = context.get('game') as Game;
  const player = new Player(name);
  const action = context.get('action') as string;
  if (name && game && action && action === 'registerPlayer') {
    //TODO - decide if I want to create the player object (above) or check against name properties
    if (game.instance.players.includes(player.name)) {
      context.put('errorMessage', { message: 'name already in use' });
      return false;
    } else {
      game.instance.registerPlayer(name);
    }
  }
  return true;
});

export const rollCommand = CommandBuilder.build((context: Context) => {
  const action = context.get('action') as string;
  const game = context.get('game') as Game;
  if (game && action && action === 'takeTurn') {
    context.put('rollValue', game.instance.die.roll());
  }
  return true;
});

export const initialRollCommand = CommandBuilder.build((context: Context) => {
  const game = context.get('game') as Game;
  //TODO - decide if I want to check action for setOrder!!!
  game.instance.activePlayer.initialRoll = game.instance.die.roll();
  context.put('rollValue', game.instance.activePlayer.initialRoll);
  return true;
});

export const checkAllInitialRollsCommand = CommandBuilder.build(
  (context: Context) => {
    const game = context.get('game') as Game;
    const notRolled = game.instance.players.filter((p: Player) => {
      p.initialRoll === null;
    });
    if (notRolled.length === 0) {
      context.put('action', 'setOrder');
    } else {
      context.put('action', 'updatePlayer');
    }

    return true;
  }
);

export const chooseAvatarCommand = CommandBuilder.build((context: Context) => {
  const action = context.get('action') as string;
  const game = context.get('game') as Game;
  const player = context.get('activePlayer') as Player;
  const req = context.get('req') as Request;
  const avatar = req.body as unknown; //TODO - check type; it wouldn't allow type Avatar to be used
  if (action && action === 'chooseAvatar') {
    game.instance.setAvatar(player, avatar);
  }
  return true;
});

//TODO - look to refactor!!!
export const updateActivePlayerCommand = CommandBuilder.build(
  (context: Context) => {
    const action = context.get('action') as string;
    const game = context.get('game') as Game;
    if (action === 'updatePlayer' && !game.instance.player.next) {
      //update to next player in the array before order has been set
      const player = context.get('activePlayer') as Player;
      context.put(
        'activePlayer',
        game.instance.players[game.instance.players.indexOf(player) + 1]
      );
    }
    //update to next player after order has been set
    if (game.instance.activePlayer.next) {
      game.instance.activePlayer = game.instance.activePlayer.next;
      context.put('activePlayer', game.instance.activePlayer);
    }

    return true;
  }
);

export const setOrderCommand = CommandBuilder.build((context: Context) => {
  const action = context.get('action') as string;
  const game = context.get('game') as Game;
  if (action === 'setOrder') {
    const orderedPlayers = new game.instance.PlayerOrder(game.instance.players);
    orderedPlayers.linkPlayers();
    context.put('activePlayer', orderedPlayers[0]);
  }
  return true;
});

export const moveCommand = CommandBuilder.build((context: Context) => {
  const game = context.get('game') as Game;
  game.instance.activePlayer.avatar.move(); //TODO - are parenthesis needed????
  return true;
});

export const paintBoardCommand = CommandBuilder.build((context: Context) => {
  const game = context.get('game') as Game;
  context.put('boardInfo', game.instance.getInfoToDisplayBoard());
  return true;
});

// CommandBuilder.build((context: Context) => {
//   if(context.get('action') && context.getString('action') === 'registerPlayer') {
//     const {req, game} = getCargoFromContext(context)
//     const player = req.body as Player

//   console.log('Action: ${action}')
//   return true;
// }),
