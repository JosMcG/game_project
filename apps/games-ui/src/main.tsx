import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import App from './app/app';
import Waiting from './components/waiting';
import PreLoaded from './pages/pre_loaded';
import { getGameList, getGameDetails } from './services/game_service';
import GameDetails from './components/game_details';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const router = createBrowserRouter([
  {
    path: '/',
    Component: App,
    children: [
      {
        path: 'loader',
        Component: PreLoaded,
        loader: getGameList,
      },
      {
        path: '/games/:id',
        Component: GameDetails,
      },
    ],
  },
]);

root.render(
  <StrictMode>
    <RouterProvider router={router} fallbackElement={<Waiting />} />
  </StrictMode>
);
