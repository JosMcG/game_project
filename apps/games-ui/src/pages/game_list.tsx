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
import { LiteGame } from '@jmcguinness/model';
import Waiting from '../components/waiting';
import { Button, Container, Paper } from '@mui/material';
import { useLoaderData, useNavigate } from 'react-router-dom';

function GameList() {
  const games = useLoaderData() as Array<LiteGame>; //ASK about how this finds the right info
  const nav = useNavigate();

  return (
    <Container
      style={{
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Paper
        elevation={5}
        style={{
          background: '#edeff0',
          padding: '10px 25px 10px 25px',
          marginTop: '50px',
        }}
      >
        {/*<Paper elevation={0} style={{ background: '#f0f03a', padding: '10px' }}>*/}
        {games.length > 0 ? (
          <ul
            style={{
              flexDirection: 'column',
              display: 'flex',
              alignItems: 'center',
              padding: '0',
            }}
          >
            {games.map((g) => (
              <Button
                key={g.id}
                fullWidth
                style={{
                  margin: '10px',
                  fontWeight: '550',
                  color: '#2e3030',
                }} //TODO - figure out how to use form actions to navigate to details
                variant="contained"
                onClick={() => nav(`/games/${g.id}`)}
              >
                {g.name}
              </Button>
            ))}
          </ul>
        ) : (
          <Waiting />
        )}
        {/*</Paper>*/}
      </Paper>
    </Container>
  );
}

export default GameList;

//'#f0f03a'  yellow
//#ed462f  red
//#3ac245  green
