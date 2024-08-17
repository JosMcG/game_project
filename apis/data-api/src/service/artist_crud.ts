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

//This is where CRUD functions should go

import { artist, Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const findAllArtists = () => {
  return prisma.artist.findMany(); //prisma function returns a promise
};

export const findArtist = (id: number) => {
  return prisma.artist.findUnique({
    where: {
      artist_id: id,
    },
  });
};

//TODO - think about this to see if it is what I really want
export const findArtistId = (artistName: string) => {
  return prisma.artist.findFirst({
    where: {
      name: artistName,
    },
  });
};

export const updateArtist = (id: number, artist: artist) => {
  if (id === artist.artist_id) {
    return prisma.artist.update({
      where: {
        artist_id: artist.artist_id,
      },
      data: {
        name: artist.name,
      },
    });
  }
};

export const createArtist = (artistName: string) => {
  return prisma.artist.create({
    data: {
      name: artistName,
    },
  });
};

export const deleteArtist = (id: number) => {
  return prisma.artist.delete({
    where: {
      artist_id: id,
    },
  });
};
