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
import { Router, Request, Response } from 'express';
import {
  liteChutesAndLadders,
  Game,
  liteHangMan,
  playChutesAndLadders,
  ContextVariables,
} from '@jmcguinness/model';
import { addTimedSession, reaper } from './gameUtils';
import { ContextBuilder } from '@jmcguinness/chain';

//This info would be in a database
const gameList = [liteChutesAndLadders, liteHangMan];
const playableGames = new Map<string, Game>();
const timedSessions = new Map<number, Array<string>>();

function getPlayableGame(playId) {
  return playableGames.get(playId);
}

function findGameRoom(gameRoom: string): Game {
  const arr = [...playableGames.values()];
  console.log(arr);
  const gameFound = arr.filter((game) => game.gameRoom === gameRoom);
  return gameFound[0];
}

const games = (req: Request, resp: Response) => {
  setTimeout(() => {
    resp.status(200);
    resp.json(gameList);
  }, 0);
};

const selectedGame = (req: Request, resp: Response) => {
  const selectedGameId = req.params.id;
  const game = gameList.find(({ id }) => id === selectedGameId);
  resp.json(game);
};

const notQuitePlayableGame = (req: Request, resp: Response) => {
  const selectedGame = req.params.id;
  if (selectedGame === 'Chutes-and-Ladders') {
    const game = playChutesAndLadders(); //TODO make sure this is creating the object correctly
    playableGames.set(game.playId, game);
    addTimedSession(timedSessions, game); //TODO fix addTimedSessions to not add duplicate uuid's
    resp.json({
      gameId: game.gameId,
      playId: game.playId,
      timeCreated: game.timeCreated,
    });
  }
  if (selectedGame === 'Hang-Man') {
    resp.status(404);
  }
};

const joiningGame = (req: Request, resp: Response) => {
  console.log('finding game for ' + req.params.room);
  const game = findGameRoom(req.params.room);
  console.log('found game: ' + game);
  if (game) {
    resp.json({
      gameId: game.gameId,
      playId: game.playId,
      gameRoom: game.gameRoom,
    });
  } else {
    resp.status(404);
  }
};
//TODO - for every request create a new context to execute against the static chain
const executeAction = (req: Request, resp: Response) => {
  const data = req.body;
  console.log('looking up game: ' + data.playId);
  //const playerName = data.playerName;
  if (data.playId) {
    const game = getPlayableGame(data.playId);
    console.log('found game ' + game);
    const action = req.params.action;
    console.log('uuid: ' + game.playId + ' and action: ' + action);
    const ctx = ContextBuilder.build();
    ctx.put(ContextVariables.GAME.toString(), game);
    ctx.put(ContextVariables.REQUEST.toString(), req);
    ctx.put(ContextVariables.RESPONSE.toString(), resp);
    ctx.put(ContextVariables.ACTION.toString(), action);
    game.action.execute(ctx);
  } else {
    resp.status(404); //TODO make an error message to send back
  }
};

const intervalId = setInterval(reaper, 60000, timedSessions);

export class GameRoutes {
  constructor(router: Router) {
    router.get('/games', games);
    router.get('/games/:id', selectedGame);
    router.post('/games/:id/:action', notQuitePlayableGame);
    router.get('/games/:id/:action/:room', joiningGame);
    router.patch('/games/:id/:action', executeAction);
  }
}
