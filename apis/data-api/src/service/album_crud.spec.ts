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
  createAlbum,
  deleteAlbum,
  findAllAlbums,
  findAlbum,
  updateAlbum,
} from './album_crud';
import { findArtist } from './artist_crud';

// axios.put(`http://localhost:3334/api/artists/10`).then();

// // describe('Test find all artists', () => {
// //   it('should return a list', () => {
// //     findAllArtists().then((results) => {
// //       console.log('checking length to be ' + results.length);
// //       expect(results.length).toBeGreaterThan(0);
// //     });
// //   });
// // });

describe('Test create album', () => {
  const albumTitle = 'New Album';
  const artistId = 275;
  const artist = findArtist(artistId);
  let id: number;
  let beforeCreate: number;
  it('should verify the album list length is greater than 0', async () => {
    const countResults = await findAllAlbums();
    beforeCreate = countResults.length;
    console.log('length before creating entry is ' + countResults.length);
    expect(countResults.length).toBeGreaterThan(0);
  });

  // //The right side of an await is a promise; the left side is the value of the promise
  it('should create an album', async () => {
    const createdAlbum = await createAlbum(
      albumTitle,
      (
        await artist
      ).artist_id
    );
    id = createdAlbum.album_id;
    expect(createdAlbum).toBeTruthy();
  });

  it('should verify the list length is incremented by one', async () => {
    const allAlbums = await findAllAlbums();
    console.log('checking after create ' + allAlbums.length);
    expect(allAlbums.length).toBe(beforeCreate + 1);
  });

  it('should return an album by id', async () => {
    const foundAlbum = await findAlbum(id);
    console.log('found the album ' + foundAlbum.title);
    expect(foundAlbum.title).toBe('New Album');
  });

  it('should update the album name', async () => {
    const album = {
      album_id: id,
      title: 'Updated album',
      artist_id: artistId,
    };
    const updatedAlbum = await updateAlbum(id, album);
    expect(updateAlbum).toBeTruthy();
    expect(updatedAlbum.title).toBe('Updated album');
  });

  it('should delete the album row', async () => {
    const deletedAlbum = await deleteAlbum(id);
    console.log('deleting album ' + deletedAlbum.title);
    const checkDelete = findAlbum(deletedAlbum.album_id);
    expect(checkDelete).toBeFalsy;
  });
});
