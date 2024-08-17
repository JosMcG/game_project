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
import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import axios from 'axios';

const Board = () => {
  const d = useLoaderData() as string;
  const data = JSON.parse(d);
  console.log(data);
  const ctx = React.useContext(GameContext);
  //ctx.waiting = data.waitingForPlayers as boolean;
  ctx.gameRoom = data.room as string;
  //add player to context if one was returned from server
  if (data.player) ctx.playerId = data.player.playerId;
  console.log('game is ' + data.gameId);
  console.log('play id: ' + data.playId);
  console.log('game room is: ' + ctx.gameRoom);
  console.log('number of players is: ' + data.playerNum);
  const [pageData, setPageData] = useState(data);

  // let spaces = data.spaces
  // let activePlayer = data.activePlayer;
  // let numPlayers = data.playerNum;
  // let room = data.room; //Not sure if I need this or player in state
  // let waiting = data.waitingForPlayers;
  // let players = data.players;

  pageData.activePlayer
    ? console.log('active player is ' + pageData.activePlayer.playerName)
    : console.log('no active player');

  const displaySpaces = [];
  for (let i = 0; i < pageData.spaces.length; i = i + 10) {
    if ((Math.floor(pageData.spaces[i].spaceNum) / 10) % 2 === 0) {
      for (let n = i; n < i + 10; n++) {
        displaySpaces.push(pageData.spaces[n]);
      }
    } else {
      let arrChunk = pageData.spaces.slice(i, i + 10);
      arrChunk = arrChunk.reverse();
      for (let n = 0; n < 10; n++) {
        displaySpaces.push(arrChunk[n]);
      }
    }
  }
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('send gameId: ' + pageData.gameId);
      console.log('send playId: ' + pageData.playId);
      console.log('send playerId: ' + ctx.playerId);
      console.log('send room: ' + pageData.room);
      axios
        .patch(
          `http://localhost:3333/api/v1/games/${pageData.gameId}/refresh`,
          {
            game: pageData.gameId,
            playId: pageData.playId,
            playerId: ctx.playerId,
            room: pageData.room,
          }
        )
        .then((resp) => resp.data)
        .then((data) => {
          console.log(JSON.stringify(data));
          setPageData(JSON.stringify(data));
        });
    }, 10000);
    return () => clearInterval(interval);
  }, [pageData.gameId, pageData.playId, pageData.room, ctx.playerId]);

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

  //TODO - continue this - check player to see if the name is enough
  const handleClick = () => {
    if (ctx.playerId === pageData.activePlayer.playerId) {
      axios.patch(`http://localhost:3333/api/v1/games/${data.gameId}/roll`, {
        game: data.gameId,
        playId: data.playId,
        playerId: ctx.playerId,
        room: data.gameRoom,
      });
    } else {
      <p> Not your turn </p>;
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 8fr' }}>
      <div style={{ padding: '20px' }}>
        <h3 style={{ marginBottom: '0px' }}>Game Room: </h3>{' '}
        <p style={{ marginTop: '0px' }}>{ctx.gameRoom}</p>
        <h3 style={{ marginBottom: '0px' }}> Number Playing: </h3>
        <p style={{ marginTop: '0px' }}>{pageData.playerNum}</p>
        <h3 style={{ marginBottom: '0px' }}> Players Registered: </h3>
        {pageData.players.length === 0
          ? null
          : pageData.players.map((p: string) => (
              <p style={{ marginTop: '0px', marginBottom: '0px' }} key={p}>
                {p}
              </p>
            ))}
        {pageData.waitingForPlayers ? (
          <p style={{ fontWeight: 'bold', color: '#e33020' }}>
            Waiting for More Players
          </p>
        ) : null}
        {!pageData.waitingForPlayers ? (
          <>
            <h3 style={{ marginBottom: '0px' }}>Active Player:</h3>
            <p style={{ marginTop: '0px' }}>
              {pageData.activePlayer.playerName}
            </p>
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
              onClick={handleClick}
            >
              Roll
            </Button>
          </>
        ) : null}
        {pageData.roll ? (
          <p>
            {pageData.activePlayer.name} rolled a {pageData.roll}
          </p>
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
