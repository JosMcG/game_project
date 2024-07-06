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
import { Button, TextField } from '@mui/material';
import { Modal } from '@mui/base/Modal';
import React from 'react';
import { Form, useLoaderData } from 'react-router-dom';
import { ModalContent } from '../components/modal';

function GameDetails() {
  const [open, setOpen] = React.useState<boolean>(false);
  const game = useLoaderData() as LiteGame;
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
      <div style={{ display: 'flex' }}>
        <Form method="POST">
          <Button
            style={{
              marginTop: '20px',
              marginRight: '50px',
              fontWeight: '550',
              color: '#2e3030',
              width: '175px',
            }}
            variant="contained"
            size="large"
            name="action" //required in order to be a Form
            value="start" //required in order to be a Form
            type="submit"
          >
            Start a Game
          </Button>
        </Form>
        <Button
          style={{
            width: '175px',
            marginTop: '20px',
            fontWeight: '550',
            color: '#2e3030',
          }}
          variant="contained"
          size="large"
          type="button"
          onClick={handleOpen}
        >
          Join a Game
        </Button>
        <Modal
          aria-labelledby="unstyled-modal-title"
          aria-describedby="unstyled-modal-description"
          open={open}
          onClose={handleClose}
        >
          <ModalContent
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
            }}
          >
            <Form method="POST">
              <TextField
                name="gameRoom"
                placeholder="Enter Game Room"
                required
                style={{ marginRight: '25px' }}
              ></TextField>
              <Button
                style={{
                  width: '100px',
                  margin: '10px auto',
                  fontWeight: '550',
                  color: '#2e3030',
                }}
                variant="contained"
                size="small"
                type="submit"
                name="action"
                value="join"
              >
                Join
              </Button>
            </Form>
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}

export default GameDetails;
