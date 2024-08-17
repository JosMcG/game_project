/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express, { Request, Response } from 'express';
import cors from 'cors';
import artists from './routes/artists';
import albums from './routes/albums';

const corsOptions = {
  origin: 'http://localhost:4200',
  optionsSuccessStatus: 200, //some legacy browsers have issues with 204
};

const app = express();
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, resp: Response) => resp.status(200).send());
app.use('/api', artists);
app.use('/api', albums);

app.get('/health', (req: Request, resp: Response) => {
  resp.status(200).send('Ok');
});

const port = process.env.PORT || 3334;
//This is what is actually building the express server - this is a build pattern
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
