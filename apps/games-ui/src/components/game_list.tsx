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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useEffect, useState } from 'react';
import { Game } from '@jmcguinness/model';
import Waiting from './waiting';
import { Button } from '@mui/material';

export function GameList() {
  const [games, setGames] = useState<Array<Game>>([]);

  useEffect(() => {
    console.log('Running Effect');
    fetch('http://localhost:3333/api/v1/games')
      .then((resp) => resp.json())
      .then((games) => {
        setGames(games);
      });
  }, [setGames]);
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      {games.length > 0 ? (
        <nav>
          <ul>
            {games.map((g) => (
              <a href="/games/{g.id}">
                <Button variant="contained">{g.name}</Button>
              </a>
            ))}
          </ul>
        </nav>
      ) : (
        <Waiting />
      )}
    </div>
  );
}

export default GameList;
