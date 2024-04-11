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
} from '@jmcguinness/model';
import { addTimedSession, reaper } from './gameUtils';

//This info would be in a database
const gameList = [liteChutesAndLadders, liteHangMan];
const playableGames = new Map<string, Game>();
const timedSessions = new Map<number, Array<string>>();

const games = (req: Request, resp: Response) => {
  setTimeout(() => {
    resp.json(gameList);
    resp.status(200);
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
    const game = playChutesAndLadders as Game; //TODO make sure this is creating the object correctly
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

const registerPlayer = (req: Request, resp: Response) => {
  const data = req.body;
  const playerName = data.playerName;
  if (data.playId) {
    const game = playableGames.get(data.playId);
    game.instance.registerPlayer(playerName);
    //console.log(game.instance.players);
    const spaces = [];
    let cur = game.instance.board.end;
    for (
      let i = game.instance.board.start.value;
      i <= game.instance.board.end.value;
      i++
    ) {
      spaces.push({
        spaceNum: cur.value,
        spaceType: cur.type,
        special: cur.special ? cur.special.value : 0,
        avatar: cur.avatars,
      });
      if (cur.value > 1) {
        cur = cur.previous;
      }
    }
    console.log(game.instance.players);
    for (let i = 0; i < spaces.length; i++) {
      console.log(spaces[i]);
    }
    resp.json({
      playId: data.playId,
      spaces: spaces,
    }); //TODO figure out what to respond with - a board? (need to write print board)
  } else {
    resp.status(404); //TODO make an error message to send back
  }
};

const intervalId = setInterval(reaper, 60000, timedSessions);

export class GameRoutes {
  constructor(router: Router) {
    router.get('/games', games);
    router.get('/games/:id', selectedGame);
    router.post('/games/:id', notQuitePlayableGame);
    router.put('/games/:id/register', registerPlayer);
  }
}
