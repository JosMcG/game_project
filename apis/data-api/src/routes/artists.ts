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
import { artist } from '@prisma/client';
import {
  createArtist,
  deleteArtist,
  findAllArtists,
  findArtist,
  updateArtist,
} from '../service/artist_crud';

const router = Router(); //see in multiple places - all get back the only router object

router.get('/artists', (req: Request, resp: Response) => {
  findAllArtists()
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

router.get('/artists/:id', (req: Request, resp: Response) => {
  const selectedId = parseInt(req.params.id);
  findArtist(selectedId)
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
router.put('/artists/:id', (req: Request, resp: Response) => {
  const artist = req.body as artist;
  updateArtist(parseInt(req.params.id), artist)
    .then((val) => {
      resp.status(200).send(val);
    })
    .catch((err) => {
      resp.status(403).send({ error: err });
    });
});

router.post('/artists', (req: Request, resp: Response) => {
  const artist = req.body as artist; //generated objects with Prisma
  createArtist(artist)
    .then((val) => {
      resp.status(200).send(val);
    })
    .catch((err) => {
      resp.status(403).send({ error: err });
    });
});

router.delete('/artists/:id', (req: Request, resp: Response) => {
  const selectedId = parseInt(req.params.id);
  deleteArtist(selectedId)
    .then((val) => {
      resp.status(200).send(val);
    })
    .catch((err) => {
      resp.status(403).send({ error: err });
    });
});

export default router;
