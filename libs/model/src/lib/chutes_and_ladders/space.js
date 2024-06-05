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
export class SpaceType {
  static START = 1;
  static NORMAL = 2;
  static CHUTE = 3;
  static LADDER = 4;
  static END = 5;
}
Object.freeze(SpaceType); //Do not want SpaceType variables to be changed

export class Space {
  value; //number of space as a string
  type; //specifies if it is a normal, ladder, chute, or winning space
  next; //Space object for the next space when traversing the board
  previous; //Space object for previous space when traversing the board
  special; //Space object (if using linked list) or number (if using array) for the destination of a type ladder or chute
  avatars; //array of avatars

  constructor(value, type) {
    this.value = value;
    this.type = type;
    this.next = null; //This will be a Space object
    this.previous = null; //This will be a Space object
    this.special = null; //This will be a Space object
    this.avatars = [];
  }

  get occupied() {
    return this.avatars.length > 0;
  }

  addAvatars(a) {
    this.avatars.push(a);
  }

  leave() {
    this.avatars.pop();
  }

  //Takes the avatar interacting with the space, and sets its location to the space it occupies
  land(avatar) {
    let gameOver = false;
    //Check to see if avatar landed on winning space
    if (this.type == SpaceType.END) {
      gameOver = true;
    }
    //Allow > 1 avatar on the start space; if avatar lands on a space already occupied,
    //move the first occupying avatar one space, then place other avatar on the space
    if (this.occupied && this.type != SpaceType.START) {
      console.log('Someone is already here');
      this.avatars[this.avatars.length - 1].move(1); //Is it okay to assume only one avatar in array?
    }
    //If avatar lands on a chute or ladder space, move it accordingly
    if (this.special) {
      avatar.location = this.special;
      this.special.addAvatars(avatar);
      //Land on a normal space
    } else {
      this.addAvatars(avatar);
      avatar.location = this;
    }
    return gameOver;
  }

  //Currently, this is a placeholder - needs built out
  //takes an array of validation functions
  valid(validators) {
    for (let f = 0; f < validators.length; f++) {
      if (!validators[f](this)) {
        return false;
      }
    }
    return true;
  }
}
