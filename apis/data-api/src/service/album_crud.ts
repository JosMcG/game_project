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

import { album, Prisma, PrismaClient } from '@prisma/client';
import { findArtistId } from './artist_crud';
import { DefaultArgs } from '@prisma/client/runtime/library';

const prisma = new PrismaClient();

export const findAllAlbums = () => {
  return prisma.album.findMany(); //prisma function returns a promise
};

export const findAlbum = (id: number) => {
  return prisma.album.findUnique({
    where: {
      album_id: id,
    },
  });
};

export const updateAlbum = (
  id: number,
  album: album
): Promise<
  Prisma.Prisma__albumClient<
    {
      album_id: number;
      title: string;
      artist_id: number;
    },
    never,
    DefaultArgs
  >
> => {
  return new Promise((accept, reject) => {
    if (id === album.album_id) {
      accept(
        prisma.album.update({
          where: {
            album_id: album.album_id,
          },
          data: {
            title: album.title,
          },
        })
      );
    } else {
      reject('invalid id');
    }
  });
};

export const createAlbum = (albumTitle: string, artistId: number) => {
  return prisma.album.create({
    data: {
      title: albumTitle,
      artist_id: artistId,
    },
  });
};

// //TODO - change this to look up artist id from artist name to create album
// export const createAlbum = async (albumTitle: string, artistName: string) => {
//   const artist = await findArtistId(artistName);
//   return prisma.album.create({
//     data: {
//       title: albumTitle,
//       artist_id: artist.artist_id,
//     },
//   });
// };

export const deleteAlbum = (id: number) => {
  return prisma.album.delete({
    where: {
      album_id: id,
    },
  });
};
