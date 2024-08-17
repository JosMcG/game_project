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

import {
  createArtist,
  deleteArtist,
  findAllArtists,
  findArtist,
  updateArtist,
} from './artist_crud';

// axios.put(`http://localhost:3334/api/artists/10`).then();

// // describe('Test find all artists', () => {
// //   it('should return a list', () => {
// //     findAllArtists().then((results) => {
// //       console.log('checking length to be ' + results.length);
// //       expect(results.length).toBeGreaterThan(0);
// //     });
// //   });
// // });

describe('Test create artist', () => {
  const artistName = 'New Artist';
  let id: number;
  let beforeCreate: number;

  it('should verify the artist list length is greater than 0', async () => {
    const countResults = await findAllArtists();
    beforeCreate = countResults.length;
    console.log('length before creating entry is ' + countResults.length);
    expect(countResults.length).toBeGreaterThan(0);
  });

  //The right side of an await is a promise; the left side is the value of the promise
  it('should create an artist', async () => {
    const createdArtist = await createArtist(artistName);
    id = createdArtist.artist_id;
    expect(createdArtist).toBeTruthy();
  });

  it('should verify the list length is incremented by one', async () => {
    const allArtists = await findAllArtists();
    console.log('checking after create ' + allArtists.length);
    expect(allArtists.length).toBe(beforeCreate + 1);
  });

  it('should return an artist by id', async () => {
    const foundArtist = await findArtist(id);
    console.log('found the artist ' + foundArtist.name);
    expect(foundArtist.name).toBe('New Artist');
  });

  it('should update the artist name', async () => {
    const artist = { artist_id: id, name: 'Updated artist' };
    const updatedArtist = await updateArtist(id, artist);
    expect(updatedArtist.name).toBe('Updated artist');
    console.log('updated artist name is ' + updatedArtist.name);
  });

  it('should delete the artist row', async () => {
    const deletedArtist = await deleteArtist(id);
    console.log('deleting artist ' + deletedArtist.name);
    const checkDelete = findArtist(deletedArtist.artist_id);
    expect(checkDelete).toBeFalsy;
  });
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
