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
import { Game } from '@jmcguinness/model';
import { ChutesAndLadders } from '@jmcguinness/model';

const gameList = [ChutesAndLadders];

const games = (req: Request, resp: Response) => {
  setTimeout(() => {
    resp.json(gameList);
    resp.status(200);
  }, 3000);
};

const selectedGame = (req: Request, resp: Response) => {
  const selectedGameId = req.params.id;
  const game = gameList.find(({ id }) => id === selectedGameId);
  resp.json(game);
};

export class GameRoutes {
  constructor(router: Router) {
    router.get('/games', games);
    router.get('/games/:id', selectedGame);
  }
}
