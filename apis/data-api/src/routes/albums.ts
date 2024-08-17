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

import { Request, Response, Router } from 'express';
import { album } from '@prisma/client';
import {
  createAlbum,
  deleteAlbum,
  findAllAlbums,
  findAlbum,
  updateAlbum,
} from '../service/album_crud';

const router = Router(); //see in multiple places - all get back the only router object

router.get('/albums', (req: Request, resp: Response) => {
  findAllAlbums()
    .then((val) => resp.status(200).send(val))
    .catch((err) => resp.status(404).send({ error: err }));
});

// router.get('/artists', async (req: Request, resp: Response) => {
//   try {
//     const allArtists = await prisma.artist.findMany();
//     resp.status(200).json(allArtists);
//   } catch (err) {
//     resp.status(404).json({ error: err });
//   }
// });

router.get('/albums/:id', (req: Request, resp: Response) => {
  const selectedId = parseInt(req.params.id);
  findAlbum(selectedId)
    .then((val) => resp.status(200).send(val))
    .catch((err) => resp.status(404).send({ error: err }));
});

// router.get('/artists/:id', async (req: Request, resp: Response) => {
//   const selectedId = req.params.id;
//   const artist = await prisma.artist.findUnique({
//     where: {
//       artist_id: Number(selectedId),
//     },
//   });
//   resp.json(artist);
// });

//example of using .then rather than async/await - does same thing;
//different way to write functionally similar code
router.put('/album/:id', (req: Request, resp: Response) => {
  const id = parseInt(req.params.id);
  const album = req.body as album;
  updateAlbum(id, album)
    .then((val) => {
      resp.status(200).send(val);
    })
    .catch((err) => {
      resp.status(403).send({ error: err });
    });
});

router.post('/albums', (req: Request, resp: Response) => {
  const album = req.body as album; //generated objects with Prisma
  const artistName = req.body as number;
  createAlbum(album.title, artistName)
    .then((val) => {
      resp.status(200).send(val);
    })
    .catch((err) => {
      resp.status(403).send({ error: err });
    });
});

router.delete('/artists/:id', (req: Request, resp: Response) => {
  const selectedId = parseInt(req.params.id);
  deleteAlbum(selectedId)
    .then((val) => {
      resp.status(200).send(val);
    })
    .catch((err) => {
      resp.status(403).send({ error: err });
    });
});

export default router;
