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

import { useLoaderData } from 'react-router-dom';

const Board = () => {
  const d = useLoaderData() as string;
  const data = JSON.parse(d);
  const spaceInfo = data.spaces;
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
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr',
        margin: 'auto auto 25px auto',
        width: '1000px',
      }}
    >
      {showBoard}
    </div>
  );
};

export default Board;
