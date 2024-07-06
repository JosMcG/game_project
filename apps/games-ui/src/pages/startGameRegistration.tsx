// Copyright 2024 Josilyn McGuinness
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
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

import { Game } from '@jmcguinness/model';
import { Button, Container, Paper, TextField } from '@mui/material';
import { useFormik } from 'formik';
import { useLoaderData, useLocation, useSubmit } from 'react-router-dom';
import * as Yup from 'yup';

type RegisterForm = {
  name: string;
  gameRoom: string;
  numPlayers: number;
  playId: string;
  gameId: string;
};

const StartGameRegistration = () => {
  const loc = useLocation();
  const submit = useSubmit();
  const data = useLoaderData() as Game;
  const formik = useFormik<RegisterForm>({
    initialValues: {
      name: '',
      gameRoom: '',
      numPlayers: 2,
      playId: data.playId,
      gameId: data.gameId,
    },
    //TODO - figure out how to show error message if invalid input is submitted
    validationSchema: Yup.object({
      name: Yup.string()
        .max(18, 'Must be 18 characters or less')
        .required('Required'),
      gameRoom: Yup.string()
        .max(18, 'Must be 18 characters or less')
        .required('Required'),
      numPlayers: Yup.number()
        .min(2, 'Must be at least two players')
        .max(4, 'Must not be more than four players')
        .required('Required'),
    }),
    onSubmit: async (values) => {
      submit(values, { method: 'post' });
    },
  });
  //console.log(formik.errors);
  return (
    <Paper
      elevation={1}
      style={{
        width: 400,
        display: 'flex',
        margin: 'auto',
        padding: '30px',
      }}
    >
      <Container maxWidth="sm">
        <h2>Please Register to Play {formik.values.gameId} </h2>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            id={'name'}
            name="name"
            placeholder="Player Name"
            onChange={formik.handleChange}
            value={formik.values.name}
            style={{
              margin: '10px',
              fontWeight: '550',
              display: 'block',
            }}
            /*error={formik.errors.name !== undefined}*/
            /*helperText={formik.touched.name ? formik.errors.name : ''}*/
          />
          <TextField
            id={'gameRoom'}
            name="gameRoom"
            placeholder="Game Room Name"
            onChange={formik.handleChange}
            value={formik.values.gameRoom}
            style={{
              margin: '10px',
              fontWeight: '550',
              display: 'block',
            }}
          />
          {loc.state ? (
            <TextField
              id={'numPlayers'}
              name="numPlayers"
              placeholder="Number of Players"
              onChange={formik.handleChange}
              value={formik.values.numPlayers}
              style={{
                margin: '10px',
                fontWeight: '550',
                display: 'block',
              }}
            />
          ) : null}
          <Button
            type="submit"
            style={{
              margin: '10px',
              fontWeight: '550',
              color: '#2e3030',
            }}
            variant="contained"
          >
            Register
          </Button>
        </form>
      </Container>
    </Paper>
  );
};

export default StartGameRegistration;
