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
import { useEffect, useState } from 'react';
import { Game } from '@jmcguinness/model';

export function GameDetails() {
  const [games, setGames] = useState<Array<Game>>([]);

  useEffect(() => {
    console.log('Running Effect');
    fetch('http://localhost:3333/api/v1/games/:id')
      .then((resp) => resp.json())
      .then((games) => {
        setGames(games);
      });
  }, [setGames]);
  return (
    <ul>
      {games.map((g) => (
        <li>
          {g.name}
          <img src={g.imageURL} alt={g.name} width="50px" />
          <p>{g.description}</p>
          <h3>Rules</h3>
          {g.rules.map((r) => (
            <dl>
              <dt>{r.title}</dt>
              <dd>{r.value}</dd>
            </dl>
          ))}
        </li>
      ))}
    </ul>
  );
}

export default GameDetails;
