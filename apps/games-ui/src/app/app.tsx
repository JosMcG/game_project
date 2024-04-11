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
import RegisterPlayer from '../pages/registerPlayer';
import { themeOptions } from '../theme';
import Waiting from '../components/waiting';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Board from '../pages/board';
import { Game } from '@jmcguinness/model';

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
            children: [
              {
                index: true,
                Component: GameDetails,
                loader: ({ params }) => getGameDetails(params.id),
                action: getPlayId,
              },
              {
                path: 'register',
                Component: RegisterPlayer,
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
