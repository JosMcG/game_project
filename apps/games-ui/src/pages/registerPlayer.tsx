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
import { Button, Container, TextField } from '@mui/material';
import { useFormik } from 'formik';
import { useLoaderData, useSubmit } from 'react-router-dom';
import * as Yup from 'yup';

type RegisterForm = {
  name: string;
  playId: string;
  gameId: string;
};

const RegisterPlayer = () => {
  const submit = useSubmit();
  const data = useLoaderData() as Game;
  const formik = useFormik<RegisterForm>({
    initialValues: {
      name: '',
      playId: data.playId,
      gameId: data.gameId,
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .max(20, 'Must be 20 characters or less')
        .required('Required'),
    }),
    onSubmit: async (values) => {
      submit(values, { method: 'put' });
    },
  });
  //console.log(formik.errors);
  return (
    <Container>
      <h2>Please Register to Play {formik.values.gameId} </h2>
      <form onSubmit={formik.handleSubmit}>
        <TextField
          id="name"
          name="name"
          placeholder="Player Name"
          onChange={formik.handleChange}
          value={formik.values.name}
          style={{
            margin: '10px',
            fontWeight: '550',
            display: 'block',
            width: '325px',
          }}
          /*error={formik.errors.name !== undefined}*/
          /*helperText={formik.touched.name ? formik.errors.name : ''}*/
        />

        <Button
          type="submit"
          style={{
            margin: '10px',
            fontWeight: '550',
            color: '#2e3030',
          }} //TODO - figure out how to use form actions to navigate to details
          variant="contained"
        >
          Register
        </Button>
      </form>
    </Container>
  );
};

export default RegisterPlayer;
