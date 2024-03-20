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
    const game = await axios.get(`http://localhost:3333/api/v1/games/${id}`); //tics allow ${} to be interpreted
    return game.data;
  }
  return null;
};

export const getPlayId = async ({ request }: ActionFunctionArgs) => {
  const body = await request.formData();
  const id = body.get('id');
  console.log('ID is ' + id);
  const data = await axios
    .post(`http://localhost:3333/api/v1/games/${id}`, {})
    .then((resp) => resp.data)
    .then((data) => {
      console.log('Data: ' + JSON.stringify(data));
      //put in session storage or local storage - session storage.set state variable
      localStorage.setItem('actionData', JSON.stringify(data));
      return data;
    });
  return redirect(`/games/register`);
};

/*  return new Response(data, {
    status: 302,
    headers: { Location: 'register' },
  });*/
