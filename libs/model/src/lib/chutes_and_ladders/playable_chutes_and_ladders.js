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
import { generateRandomNumInRange } from './functions';
import { Space, SpaceType } from './space';
import { Board } from './board';
import { Player, PlayerOrder } from './player';
import { Avatar } from './avatar';
import { Die } from './die';

const NUM_SPACES = 100;
const ROW_LENGTH = 10;
const SPAN = 40;
const MIN_PLAYERS = 2;
const MAX_PLAYERS = 4;
const NUM_CHUTES = 5;
const NUM_LADDERS = 5;

const createSpace = (label, type) => {
  return new Space(label.toString(), type);
};

const isAlreadySpecial = (position, specialArr) => {
  return specialArr.includes(position.toString());
};

const determinePosition = (min, max, specialSpaces) => {
  let position;
  do {
    position = generateRandomNumInRange(min, max);
  } while (isAlreadySpecial(position, Object.keys(specialSpaces)));
  //specialSpaces[position] = createSpace(position, type);

  return position;
};

//determine the chute and ladder positions,
//add the corresponding created spaces to the specialSpaces object,
//and do the same for the end positions by calling assignSpecialEnd()
const assignSpecial = (type, specialSpaces) => {
  let min;
  let max;
  switch (type) {
    case SpaceType.CHUTE:
      min = ROW_LENGTH + 1;
      max = NUM_SPACES - 1;
      break;
    case SpaceType.LADDER:
      min = 2;
      max = NUM_SPACES - ROW_LENGTH + 1;
      break;
  }
  let startPosition = determinePosition(min, max, specialSpaces);
  specialSpaces[startPosition] = createSpace(startPosition, type);
  specialSpaces = assignSpecialEnd(startPosition, type, specialSpaces);
  return specialSpaces;
};

const assignSpecialEnd = (startPosition, type, specialSpaces) => {
  let min;
  let max;
  switch (type) {
    case SpaceType.CHUTE:
      min = startPosition - SPAN > 0 ? startPosition - SPAN : 2;
      max = Math.floor(startPosition / ROW_LENGTH) * ROW_LENGTH;
      break;
    case SpaceType.LADDER:
      min = Math.ceil(startPosition / ROW_LENGTH) * ROW_LENGTH + 1;
      max =
        NUM_SPACES - startPosition > SPAN
          ? startPosition + SPAN
          : NUM_SPACES - 1; //This does not allow ladder to winning space. Do we include the final space???
      break;
  }
  let endPosition = determinePosition(
    min,
    max,
    SpaceType.NORMAL,
    specialSpaces
  );
  specialSpaces[endPosition] = createSpace(endPosition, SpaceType.NORMAL);
  specialSpaces[startPosition].special = specialSpaces[endPosition];
  return specialSpaces;
};

//create all chutes, all ladders, and final space and return them in an object
const createSpecials = (numChutes, numLadders) => {
  let specialSpaces = new Object();
  for (let n = 0; n < numChutes; n++) {
    specialSpaces = assignSpecial(SpaceType.CHUTE, specialSpaces);
  }
  for (let n = 0; n < numLadders; n++) {
    specialSpaces = assignSpecial(SpaceType.LADDER, specialSpaces);
  }
  specialSpaces[NUM_SPACES] = createSpace(NUM_SPACES, SpaceType.END);
  return specialSpaces;
};

export const pawn = (color) => {
  return new Avatar(color);
};

export class ChutesAndLadders {
  players = []; //an array of player objects
  playersToRollForOrder = []; //an array of players rolling for order
  availableAvatars = ['red', 'yellow', 'green', 'blue', 'purple'];
  firstPlayer = undefined; //for linked list of players
  //order = []; //an array of players in the order they should play -> changed to linking the players in order
  die = new Die(6);
  boardDisplayInfo = [];
  activePlayer = null;

  constructor() {
    this.startSpace = new Space('1', SpaceType.START);
    this.specialSpaces = createSpecials(NUM_CHUTES, NUM_LADDERS); //put #chutes and ladders here and eliminate the this. values
    this.board = new Board(
      this.startSpace,
      NUM_SPACES,
      this.specialSpaces,
      createSpace
    );
  }

  getRowLength() {
    return ROW_LENGTH;
  }

  //Sets up a new board with avatars set on start space
  resetBoard() {
    this.board = new Board(
      this.startSpace,
      NUM_SPACES,
      this.specialSpaces,
      createSpace
    );
    this.selectedAvatars.forEach((a) => (a.location = this.startSpace));
  }

  //Returns true if more players can register
  registerPlayer(name) {
    const player = new Player(name);
    this.players.push(player);
    this.playersToRollForOrder.push(player);
    if (this.players.length == 1) {
      this.firstPlayer = this.playersToRollForOrder[0];
      this.activePlayer = player;
    }
    // let canAddPlayer = player.length < MAX_PLAYERS ? true : false; //not sure if I will use a bool or just check number
    // return canAddPlayer;
  }

  setAvatar(player, color) {
    if (this.availableAvatars.includes(color)) {
      player.avatar = pawn(color);
      player.avatar.location = this.startSpace;
      this.availableAvatars = this.availableAvatars.filter(
        (c) => c != player.avatar.color
      );
    } else console.log('Color not available.'); //TODO add error checking
  }

  setUpGame() {
    if (this.players.length < MIN_PLAYERS) {
      console.log('Need more players.'); //redirect to invite players
    }
    let orderedPlayers = new PlayerOrder(this.players);
    orderedPlayers.linkPlayers();
    this.players = orderedPlayers.players;
    this.firstPlayer = this.players[0];
  }

  verifySetUp() {
    let ready = true;
    this.players.forEach((p) => {
      if (!p.avatar) {
        ready = false;
      }
    });
    return ready;
  }

  //TODO - make sure avatar and player do not cause circular reference!!!
  getInfoToDisplayBoard() {
    this.boardDisplayInfo = [];
    let cur = this.board.end;
    for (let i = this.board.start.value; i <= this.board.end.value; i++) {
      this.boardDisplayInfo.push({
        spaceNum: cur.value,
        spaceType: cur.type,
        special: cur.special ? cur.special.value : 0,
        avatar: cur.avatars,
        players: cur.players,
        activePlayer: this.activePlayer,
      });
      if (cur.value > 1) {
        cur = cur.previous;
      }
    }
    return this.boardDisplayInfo;
  }
}
//module.exports = PlayableChutesAndLadders;
