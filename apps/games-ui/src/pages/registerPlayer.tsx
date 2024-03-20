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

import { Game } from '@jmcguinness/model';
import { Container } from '@mui/material';
import { Form } from 'react-router-dom';

// limitations under the License.
function RegisterPlayer() {
  const data = localStorage.getItem('actionData');
  let idValue = 'No Game Found';
  let name = '';
  if (data) {
    const d: Game = JSON.parse(data);
    name = d.gameId;
    idValue = d.playId;
  }

  return (
    <Container>
      <h3>Your {name} game id is: </h3>
      <h4>{idValue}</h4>
      <h4>Please register and invite the other players. </h4>
      <Form>
        <input type="text" id="name" name="name" value="Player Name" />
      </Form>
    </Container>
  );
}

export default RegisterPlayer;
