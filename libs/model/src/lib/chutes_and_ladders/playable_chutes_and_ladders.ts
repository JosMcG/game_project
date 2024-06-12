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
import { Color, Avatar } from './avatar';
import { Die } from './die';

const NUM_SPACES = 100;
const ROW_LENGTH = 10;
const SPAN = 40;
const MIN_PLAYERS = 2;
//const MAX_PLAYERS = 4;
const NUM_CHUTES = 5;
const NUM_LADDERS = 5;

const createSpace = (label: number, type: SpaceType): Space => {
  return new Space(label.toString(), type);
};

// const isAlreadySpecial = (position: number, specialArr: Array<string>) => {
//   return specialArr.includes(position.toString());
// };

const determinePosition = (
  min: number,
  max: number,
  specialSpaces: Map<number, Space>
): number => {
  let position: number;
  do {
    position = generateRandomNumInRange(min, max);
  } while (specialSpaces.has(position));
  //specialSpaces[position] = createSpace(position, type);

  return position;
};

//determine the chute and ladder positions,
//add the corresponding created spaces to the specialSpaces object,
//and do the same for the end positions by calling assignSpecialEnd()
const assignSpecial = (
  type: SpaceType,
  specialSpaces: Map<number, Space>
): Map<number, Space> => {
  let min = 0; //let min: number;
  let max = 0; //let max: number;
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
  const startPosition: number = determinePosition(min, max, specialSpaces);
  specialSpaces.set(startPosition, createSpace(startPosition, type));
  specialSpaces = assignSpecialEnd(startPosition, type, specialSpaces);
  return specialSpaces;
};

const assignSpecialEnd = (
  startPosition: number,
  type: SpaceType,
  specialSpaces: Map<number, Space>
): Map<number, Space> => {
  let min = 0; //TODO - Is there a good way to declare a variable without assignment in typescript????
  let max = 0;
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
  const endPosition: number = determinePosition(
    min,
    max,
    //SpaceType.NORMAL,    why did I have this here????
    specialSpaces
  );
  specialSpaces.set(endPosition, createSpace(endPosition, SpaceType.NORMAL));
  const startSpace = specialSpaces.get(startPosition);
  if (startSpace) startSpace.special = specialSpaces.get(endPosition); //TODO - why did I have to add undefined to special on space to get this to work???
  return specialSpaces;
};

//create all chutes, all ladders, and final space and return them in a map
const createSpecials = (
  numChutes: number,
  numLadders: number
): Map<number, Space> => {
  let specialSpaces = new Map<number, Space>();
  for (let n = 0; n < numChutes; n++) {
    specialSpaces = assignSpecial(SpaceType.CHUTE, specialSpaces);
  }
  for (let n = 0; n < numLadders; n++) {
    specialSpaces = assignSpecial(SpaceType.LADDER, specialSpaces);
  }
  specialSpaces.set(NUM_SPACES, createSpace(NUM_SPACES, SpaceType.END));
  return specialSpaces;
};

export const pawn = (color: Color): Avatar => {
  return new Avatar(color);
};

export class ChutesAndLadders {
  players = [] as Array<Player>; //an array of player objects
  playersToRollForOrder = [] as Array<Player>; //an array of players rolling for order
  availableAvatars = [
    Color.RED,
    Color.YELLOW,
    Color.GREEN,
    Color.BLUE,
    Color.PURPLE,
  ];
  firstPlayer: Player | undefined = undefined; //for linked list of players
  die = new Die(6);
  //boardDisplayInfo = [];
  activePlayer: Player | null = null;
  specialSpaces;
  board;

  constructor() {
    this.specialSpaces = createSpecials(NUM_CHUTES, NUM_LADDERS);
    this.board = new Board(NUM_SPACES, this.specialSpaces, createSpace);
  }

  getRowLength() {
    return ROW_LENGTH;
  }

  //Sets up a new board with avatars set on start space
  resetBoard() {
    this.board = new Board(NUM_SPACES, this.specialSpaces, createSpace);
    this.players.forEach((a) => {
      if (a.avatar) a.avatar.location = this.board.start;
    });
  }

  //Returns true if more players can register
  registerPlayer(name: string) {
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

  setAvatar(player: Player, color: Color) {
    if (this.availableAvatars.includes(color)) {
      player.avatar = pawn(color);
      console.log(player.name + ' selected ' + player.avatar.color);
      player.avatar.location = this.board.start;
      console.log(player.name + ' is ready on ' + player.avatar.location.value);
      this.availableAvatars = this.availableAvatars.filter((c) => {
        if (player.avatar) c != player.avatar.color;
      });
    } else console.log('Color not available.'); //TODO add error checking
  }

  setUpGame() {
    if (this.players.length < MIN_PLAYERS) {
      console.log('Need more players.'); //redirect to invite players
    }
    const orderedPlayers = new PlayerOrder(this.players);
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
    const boardDisplayInfo = [] as spaceInfo[];
    type spaceInfo = {
      spaceNum: string;
      spaceType: SpaceType;
      special: string;
      avatar: Avatar[];
      activePlayer: Player | null;
    };
    let cur;
    if (this.board.end) cur = this.board.end;
    let s: spaceInfo;
    //TODO - I don't like using NUM_SPACES - is there a way to use parseInt(cur.value)???
    for (let i = parseInt(this.board.start.value); i <= NUM_SPACES; i++) {
      if (cur) {
        s = {
          spaceNum: cur.value,
          spaceType: cur.type,
          special: cur.special ? cur.special.value : '0',
          avatar: cur.avatars,
          activePlayer: this.activePlayer,
        };
        boardDisplayInfo.push(s);
      }
      if (cur && parseInt(cur.value) > 1) {
        cur = cur.previous;
      }
    }
    return boardDisplayInfo;
  }
}
//module.exports = PlayableChutesAndLadders;
