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
import axios from 'axios';
import { ActionFunctionArgs, redirect } from 'react-router-dom';

export const getGameList = async () => {
  const resp = await axios.get('http://localhost:3333/api/v1/games');
  return resp.data;
};

export const getGameDetails = async (id: string | undefined) => {
  console.log('ID ' + id);
  if (id) {
    const resp = await axios.get(`http://localhost:3333/api/v1/games/${id}`); //tics allow ${} to be interpreted
    return resp.data;
  }
  return null;
};

export const getPlayId = async ({ request, params }: ActionFunctionArgs) => {
  const id = params.id;
  const body = await request.formData();
  const action = body.get('action');
  const room = body.get('gameRoom');
  console.log('ID is ' + id);
  console.log('action is ' + action);
  //localStorage.clear();
  if (action === 'start') {
    await axios
      .post(`http://localhost:3333/api/v1/games/${id}/${action}`)
      .then((resp) => resp.data)
      .then((data) => {
        console.log('Data: ' + JSON.stringify(data));
        //put in session storage or local storage - session storage.set state variable
        localStorage.setItem('actionData', JSON.stringify(data));
      });
    return redirect(`/games/${id}/registerStart`);
  }
  if (action === 'join') {
    console.log('handle the join for ' + room);
    await axios
      .get(`http://localhost:3333/api/v1/games/${id}/${action}/${room}`)
      .then((resp) => resp.data)
      .then((data) => {
        console.log('Data: ' + JSON.stringify(data));
        //put in session storage or local storage - session storage.set state variable
        localStorage.setItem('actionData', JSON.stringify(data));
      });
    return redirect(`/games/${id}/registerJoin`);
  }
};

export const registerPlayer = async ({ request }: ActionFunctionArgs) => {
  const form = await request.formData(); //contains the values from formik
  const id = form.get('gameId');
  console.log('sending request for game: ' + form.get('playId'));
  const name = form.get('name');
  const gameRoom = form.get('gameRoom');
  const numPlayers = form.get('numPlayers');
  //TODO - clean this up - remove redundancy
  await axios
    .patch(`http://localhost:3333/api/v1/games/${id}/registerPlayer`, {
      game: id,
      playId: form.get('playId'),
      player: name,
      room: gameRoom,
      numPlayers: numPlayers,
    })
    .then((resp) => resp.data)
    .then((data) => {
      //console.log('Register data: ' + JSON.stringify(data));
      localStorage.setItem('actionData', JSON.stringify(data));

      //.catch((e) => console.log(e));
    });
  return redirect(`/games/${id}/board`);
};

/*  return new Response(data, {
    status: 302,
    headers: { Location: 'register' },
  });*/
