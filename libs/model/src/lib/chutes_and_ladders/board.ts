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
import { Space, SpaceType } from './space';

export class Board {
  end;
  start;
  specials;
  constructor(
    numSpaces: number,
    specialSpaces: Map<number, Space>,
    createSpace: (label: number, type: SpaceType) => Space //NOTE - how to use a function as a parameter in typescript
  ) {
    if (specialSpaces.get(numSpaces)) {
      this.end = specialSpaces.get(numSpaces);
    }
    this.start = createSpace(1, SpaceType.START);
    this.specials = specialSpaces;
    let curSpace = this.start;
    let nextSpace;
    for (let n = 2; n <= numSpaces; n++) {
      if (specialSpaces.has(n)) {
        nextSpace = specialSpaces.get(n);
      } else {
        nextSpace = createSpace(n, SpaceType.NORMAL);
      }
      if (curSpace) curSpace.next = nextSpace;
      if (nextSpace) nextSpace.previous = curSpace;
      if (nextSpace) curSpace = nextSpace;
    }
  }

  //   display() {
  //     let cur = this.end;
  //     let arr = [];
  //     while (cur) {
  //       if (Math.floor(cur.value / 10) % 2 == 0) {
  //         for (let n = 0; n < 10; n++) {
  //           process.stdout.write(' ' + cur.value + ' ');
  //           cur = cur.previous;
  //         }
  //       } else {
  //         arr.push(cur.value);
  //         for (let n = 1; n < 10; n++) {
  //           arr.push(cur.previous.value);
  //           cur = cur.previous;
  //         }
  //         cur = cur.previous;
  //         let arrLength = arr.length;
  //         for (let n = 0; n < arrLength; n++) {
  //           process.stdout.write(' ' + arr.pop(n) + ' ');
  //         }
  //       }
  //       console.log();
  //     }
  //   }
  // createDisplayObjectArray() {
  //   const spaces = [];
  //   let cur = this.end;
  //   for (let i = this.start.value; i <= this.end.value; i++) {
  //     spaces.push({
  //       spaceNum: cur.value,
  //       spaceType: cur.type,
  //       special: cur.special ? cur.special.value : 0,
  //       avatar: cur.avatars,
  //     });
  //     if (cur.value > 1) {
  //       cur = cur.previous;
  //     }
  //     return spaces;
  //   }
  // }

  // createDisplayArray() {
  //   const spaceInfo = this.createDisplayObjectArray();
  //   const displaySpaces = [];
  //   for (let i = 0; i < spaceInfo.length; i = i + 10) {
  //     if ((Math.floor(spaceInfo[i].spaceNum) / 10) % 2 === 0) {
  //       for (let n = i; n < i + 10; n++) {
  //         displaySpaces.push(spaceInfo[n]);
  //       }
  //     } else {
  //       let arrChunk = spaceInfo.slice(i, i + 10);
  //       arrChunk = arrChunk.reverse();
  //       for (let n = 0; n < 10; n++) {
  //         displaySpaces.push(arrChunk[n]);
  //       }
  //     }
  //   }
  //   return displaySpaces;
  // }

  // displayBoard() {
  //   const displaySpaces = this.createDisplayArray();
  //   const showBoard = displaySpaces.map((space) => (
  //     <div
  //       key={space.spaceNum}
  //       style={{
  //         border: '2px solid black',
  //         backgroundColor: '#B7F6B6',
  //         height: '100px',
  //         width: '100px',
  //       }}
  //     >
  //       {space.spaceNum}
  //       {space.spaceType === 3 ? (
  //         <p>Chute to {space.special}</p>
  //       ) : space.spaceType === 4 ? (
  //         <p>Ladder to {space.special}</p>
  //       ) : null}
  //       {space.avatar.length > 0
  //         ? space.avatar.forEach((a) => <p>{a}</p>) //TODO check on what avatar actually is
  //         : null}
  //     </div>
  //   ));
  //   return showBoard;
  // }
}
