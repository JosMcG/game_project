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

import { Space } from './space';

export enum Color {
  RED = 'Red',
  YELLOW = 'Yellow',
  GREEN = 'Green',
  BLUE = 'Blue',
  PURPLE = 'Purple',
}

export class Avatar {
  color;
  name;
  location: Space | undefined = undefined;
  active = false; //Do I need this????

  constructor(color: Color) {
    this.color = color;
    this.name = 'pawn';
  }

  //Moves the avatar the given number of spaces.
  //Negative numbers will move the avatar backwards.
  move(numSpaces: number) {
    let gameOver = false;
    let loc = this.location;
    const moveDirection = numSpaces > 0 ? 'next' : 'previous';
    numSpaces = Math.abs(numSpaces); //keep the number of spaces to move positive after this point
    //Traverse through spaces according the next pointer
    for (let i = 0; i < numSpaces; ++i) {
      //Check to see if number of moves is passed the start/end spaces
      if (loc && !loc[moveDirection] && i < numSpaces) {
        console.log('Overshot the space. Stay put.');
        return gameOver;
      }
      if (loc) loc = loc[moveDirection];
    }
    this.location?.leave();
    if (loc) gameOver = loc.land(this);
    return gameOver;
  }
}
