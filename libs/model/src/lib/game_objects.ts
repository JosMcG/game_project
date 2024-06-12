// Copyright 2024 Josilyn McGuinness
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { LiteGameBuilder, GameBuilder, Game } from './model';
import { ChutesAndLadders } from './chutes_and_ladders/playable_chutes_and_ladders';
import { connectorChain } from './commands';

export const liteChutesAndLadders = new LiteGameBuilder()
  .setId('Chutes-and-Ladders')
  .setName('Chutes and Ladders')
  .setDescription(
    'Climb up ladders, and slide down shoots. See who gets to space 100 first!'
  )
  .setImageURL('/public/chute&ladderImg3.png')
  .addRule('Number of Players', 'For 2-4 Players, Ages 3+')
  .addRule(
    'Register Players',
    'Each player must register with a player name.\
    The first person to register will receive a link to share with other players.'
  )
  .addRule('Determine Order', 'Roll the dice to determine order of play.')
  .addRule(
    'Choose Pawn',
    'Following order of play, each player must select a pawn.'
  )
  .addRule(
    'Play Game',
    'Taking turns, each player rolls the dice, moving the pawn to the appropriate space.\
  If the pawn lands on a ladder or chute space, it will climb or slide respectively. If a pawn lands on an\
  occupied space, the first occupant will advance to the next space allowing the pawn in play to take the space.\
  The first pawn to reach space 100 wins the game.'
  )
  .buildGame();

// type Payload = {
//   action: string;
//   game: Game;
//   req: Request;
//   resp: Response;
// };

// const getPayloadFromContext = (context: Context): Payload => {
//   const action = context.get('action') as string;
//   const game = context.get('game') as Game;
//   const req = context.get('req') as Request;
//   const resp = context.get('resp') as Response;
//   return { action: action, game: game, req: req, resp: resp } as Payload;
// };

export const playChutesAndLadders = new GameBuilder()
  .setGameId('Chutes-and-Ladders')
  .setLastModTime(new Date(Date.now()))
  .setInstance(new ChutesAndLadders())
  .addAction(connectorChain)
  .buildPlayableGame();
