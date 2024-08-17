// eslint-disable-next-line @typescript-eslint/no-unused-vars

import {
  Outlet,
  RouterProvider,
  createBrowserRouter,
  redirect,
} from 'react-router-dom';
import Header from '../components/header';
import Footer from '../components/footer';
import './app.css';
import Welcome from '../pages/welcome';
import GameList from '../pages/game_list';
import {
  getGameDetails,
  getGameList,
  getPlayId,
  registerPlayer,
} from '../services/game_service';
import GameDetails from '../pages/game_details';
import { themeOptions } from '../theme';
import Waiting from '../components/waiting';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Board from '../pages/board';
import { Game } from '@jmcguinness/model';
import StartGameRegistration from '../pages/startGameRegistration';
import JoinGameRegistration from '../pages/joinGameRegistration';
import { createContext, useState } from 'react';

//TODO - move the interface and context to different file
export interface CurrentGame {
  game: string;
  gameId: string;
  playerName: string;
  playerId: number;
  gameRoom: string;
  waiting: boolean;
  readyToPlay: boolean;
}

export const GameContext = createContext<CurrentGame>(null!);

const ActiveGame = () => {
  const [getCurrentGame] = useState({} as CurrentGame);
  return (
    <GameContext.Provider value={getCurrentGame}>
      <Outlet />
    </GameContext.Provider>
  );
};
const theme = createTheme(themeOptions);
const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      {
        index: true, //do not need a path with index
        Component: Welcome,
      },
      {
        path: 'games',
        children: [
          { index: true, Component: GameList, loader: getGameList },
          {
            path: ':id',
            Component: ActiveGame,
            children: [
              {
                index: true,
                Component: GameDetails,
                loader: ({ params }) => getGameDetails(params.id),
                action: getPlayId,
              },
              {
                path: 'registerStart',
                Component: StartGameRegistration,
                action: registerPlayer,
                loader: () => {
                  const g = localStorage.getItem('actionData');
                  const game = JSON.parse(g as string);
                  if (game === null) {
                    return redirect('/');
                  }
                  return game as Game;
                },
              },
              {
                path: 'registerJoin',
                Component: JoinGameRegistration,
                action: registerPlayer,
                loader: () => {
                  const g = localStorage.getItem('actionData');
                  const game = JSON.parse(g as string);
                  if (game === null) {
                    return redirect('/');
                  }
                  return game as Game;
                },
              },
              {
                path: 'board',
                Component: Board,
                loader: () => {
                  const b = localStorage.getItem('actionData');
                  //const board = JSON.parse(b as string);
                  if (b === null) {
                    return redirect('/');
                  }
                  return b as string;
                },
              },
            ],
          },
        ],
      },
    ],
  },
]);

export function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} fallbackElement={<Waiting />} />
    </ThemeProvider>
  );
}
export default App;

function Layout() {
  return (
    <div className="wrapper">
      <Header />
      <div className="page-content">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

//React.Fragment can have an id? - use in Layout component to wrap instead of div
