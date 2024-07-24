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

//import { Player } from '@jmcguinness/model/src/lib/chutes_and_ladders/player';
import { useLoaderData } from 'react-router-dom';
import { GameContext } from '../app/app';
import React from 'react';
import { Button } from '@mui/material';

const Board = () => {
  const ctx = React.useContext(GameContext);
  const d = useLoaderData() as string;
  const data = JSON.parse(d);
  const spaceInfo = data.spaces;
  ctx.gameRoom = data.room as string;
  const numPlayers = data.playerNum as string;
  const players = data.players as Array<string>;
  const waiting = data.waitingForPlayers as boolean;
  //ctx.waiting = waiting;
  const activePlayer = data.activePlayer;
  activePlayer
    ? console.log('active player is ' + activePlayer.playerName)
    : console.log('no active player');
  const displaySpaces = [];
  for (let i = 0; i < spaceInfo.length; i = i + 10) {
    if ((Math.floor(spaceInfo[i].spaceNum) / 10) % 2 === 0) {
      for (let n = i; n < i + 10; n++) {
        displaySpaces.push(spaceInfo[n]);
      }
    } else {
      let arrChunk = spaceInfo.slice(i, i + 10);
      arrChunk = arrChunk.reverse();
      for (let n = 0; n < 10; n++) {
        displaySpaces.push(arrChunk[n]);
      }
    }
  }

  const showBoard = displaySpaces.map((space) => (
    <div
      key={space.spaceNum}
      style={{
        border: '2px solid black',
        backgroundColor: '#B7F6B6',
        height: '100px',
        width: '100px',
      }}
    >
      {space.spaceNum}
      {space.spaceType === 3 ? (
        <p>Chute to {space.special}</p>
      ) : space.spaceType === 4 ? (
        <p>Ladder to {space.special}</p>
      ) : null}
      {space.avatar.length > 0
        ? space.avatar.forEach((a: string) => <p>{a}</p>) //TODO check on what avatar actually is
        : null}
    </div>
  ));

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 8fr' }}>
      <div style={{ padding: '20px' }}>
        <h3 style={{ marginBottom: '0px' }}>Game Room: </h3>{' '}
        <p style={{ marginTop: '0px' }}>{ctx.gameRoom}</p>
        <h3 style={{ marginBottom: '0px' }}> Number Playing: </h3>
        <p style={{ marginTop: '0px' }}>{numPlayers}</p>
        <h3 style={{ marginBottom: '0px' }}> Players Registered: </h3>
        {players.length === 0
          ? null
          : players.map((p: string) => (
              <p style={{ marginTop: '0px', marginBottom: '0px' }} key={p}>
                {p}
              </p>
            ))}
        {waiting ? (
          <p style={{ fontWeight: 'bold', color: '#e33020' }}>
            Waiting for More Players
          </p>
        ) : null}
        {!waiting ? (
          <>
            <h3 style={{ marginBottom: '0px' }}>Active Player:</h3>
            <p style={{ marginTop: '0px' }}>{activePlayer.playerName}</p>
            <Button
              style={{
                fontWeight: '550',
                color: '#2e3030',
                width: '100px',
              }}
              variant="contained"
              size="large"
              name="action" //required in order to be a Form
              value="start" //required in order to be a Form
              type="submit"
            >
              Roll
            </Button>
          </>
        ) : null}
      </div>
      <div
        style={{
          boxShadow: '4px 4px 4px grey',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr',
          margin: 'auto auto 25px auto',
          width: '1000px',
        }}
      >
        {showBoard}
      </div>
      {ctx.gameId}
    </div>
  );
};

export default Board;
