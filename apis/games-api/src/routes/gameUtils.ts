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
const timer = 86400000;
export let expiredGames = new Array<number>();

export const reaper = (timedSessions) => {
  console.log(timedSessions);
  if (timedSessions.size) {
    timedSessions.forEach((v, k) => {
      if (k + timer <= Date.now()) {
        expiredGames = [...v];
        timedSessions.delete(k);
      }
    });
  }
};

export const addTimedSession = (timedSessions, game) => {
  if (timedSessions.has(game.timeCreated)) {
    timedSessions.get(game.timeCreated).push(game.playId);
  } else {
    timedSessions.set(game.timeCreated, [game.playId]);
  }
};
