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

import { before } from 'node:test';
import {
  createArtist,
  deleteArtist,
  findAllArtists,
  findArtist,
  updateArtist,
} from './artist_crud';
import { artist } from '@prisma/client';

// axios.put(`http://localhost:3334/api/artists/10`).then();

// describe('Test find all artists', () => {
//   it('should return a list', () => {
//     findAllArtists().then((results) => {
//       console.log('checking length to be ' + results.length);
//       expect(results.length).toBeGreaterThan(0);
//     });
//   });
// });

describe('Test create artist', () => {
  const artist = { artist_id: undefined, name: 'New Artist' };
  let beforeCreate: number;
  let afterCreate: number;
  let id = artist.artist_id;
  // it('should increase the length of the list of artists by 1', async () => {
  //   const countResults = await findAllArtists();
  //   beforeCreate = countResults.length;
  //   console.log('length before creating entry is ' + beforeCreate);
  //   expect(beforeCreate).toBeGreaterThan(0);
  // });
  //The right side of an await is a promise; the left side is the value of the promise
  it('should create an artist', async () => {
    const createdArtist = await createArtist(artist);
    id = createdArtist.artist_id;
    console.log('new id is ' + id);
    expect(createdArtist).toBeTruthy();
  });
  // it('should be incremented by at least one', () => {
  //   findAllArtists()
  //     .then((results) => {
  //       afterCreate = results.length;
  //       console.log('checking after create ' + afterCreate);
  //       expect(afterCreate).toBe(beforeCreate + 1);
  //       console.log('length after creating entry is ' + afterCreate);
  //     })
  //     .catch((err) => console.error(err));
  // });
  // it('should return an artist by id', () => {
  //   findArtist(id).then((result) => {
  //     expect(result.name).toBe('New Artist');
  //   });
  // });
  // it('should update the artist name', () => {
  //   const artist = { artist_id: id, name: 'Updated artist' };
  //   updateArtist(id, artist).then((result) => {
  //     console.log('updated artist name is ' + result.name);
  //     expect(result.name).toBe('Updated artist');
  //   });
  // });
  // it('should delete the artist row', () => {
  //   deleteArtist(500);
  //   findArtist(500).then((result) => {
  //     expect(result).toBeFalsy;
  //   });
  // });
});
//TODO - these should all be in the same describe - jest may not run describes serially
// describe('Test find artist', () => {
//   const id = 500;
//   it('should return an artist by id', () => {
//     findArtist(id).then((result) => {
//       expect(result.name).toBe('New Artist');
//     });
//   });
// });

// describe('Test update artist', () => {
//   const id = 500;
//   const artist = { artist_id: 500, name: 'Updated artist' };
//   it('should update the artist name', () => {
//     updateArtist(id, artist).then((result) => {
//       expect(result.name).toBe('Updated artist');
//     });
//   });
// });

// describe('Test delete artist', () => {
//   const id = 500;
//   it('should delete the artist row', () => {
//     deleteArtist(id);
//     findArtist(id).then((result) => {
//       expect(result).toBeFalsy;
//     });
//   });
// });

// const JosilynsPromise = Promise<string>((accept, reject) => {
//   accept("I will always love Ryan")
//   reject("")
// })
