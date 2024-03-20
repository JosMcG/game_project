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
import { LiteGame } from '@jmcguinness/model';
import { Button } from '@mui/material';
import { Form, useLoaderData } from 'react-router-dom';

function GameDetails() {
  const game = useLoaderData() as LiteGame;

  return (
    //TODO - fix
    <div style={{ margin: '30px' }}>
      <h1>{game.name}</h1>
      <img
        src={game.imageURL}
        alt={game.name}
        width="175px"
        style={{ float: 'right', marginRight: '125px', marginTop: '-50px' }}
      />
      <p>{game.description}</p>
      <h2>Rules</h2>
      {game.rules.map((r) => (
        <dl key={r.title}>
          <dt style={{ fontWeight: '550' }}>{r.title}</dt>
          <dd>{r.value}</dd>
        </dl>
      ))}
      <Form method="POST">
        <Button
          style={{
            marginTop: '20px',
            fontWeight: '550',
            color: '#2e3030',
          }}
          variant="contained"
          size="large"
          value={game.id} //required in order to be a Form
          name="id" //required in order to be a Form
          type="submit"
        >
          Start a Game
        </Button>
      </Form>
    </div>
  );
}

export default GameDetails;
