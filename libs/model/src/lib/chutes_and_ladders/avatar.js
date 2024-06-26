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

//enum for type of space
export class Color {
  static RED = 'red';
  static YELLOW = 'yellow';
  static GREEN = 'green';
  static BLUE = 'blue';
  static PURPLE = 'purple';
}
Object.freeze(Color); //Do not want Color variables to be changed

export class Avatar {
  location;
  active = false; //Do I need this????

  constructor(Color) {
    this.color = Color;
    this.name = 'pawn';
  }

  //Moves the avatar the given number of spaces.
  //Negative numbers will move the avatar backwards.
  move(numSpaces) {
    let gameOver = false;
    let loc = this.location;
    let moveDirection = numSpaces > 0 ? 'next' : 'previous';
    numSpaces = Math.abs(numSpaces); //keep the number of spaces to move positive after this point

    //Traverse through spaces according the next pointer
    for (let i = 0; i < numSpaces; ++i) {
      //Check to see if number of moves is passed the start/end spaces
      if (!loc[moveDirection] && i < numSpaces) {
        console.log('Overshot the space. Stay put.');
        return gameOver;
      }
      loc = loc[moveDirection];
    }
    this.location.leave();
    gameOver = loc.land(this);
    return gameOver;
  }
}
