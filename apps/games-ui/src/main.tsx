import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './app/app';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);

/*const router = createBrowserRouter([
  {
    path: '/',
    Component: App,
    children: [
      {
        index: true,
        Component: Welcome,
      },
      {
        path: 'games',
        Component: Outlet,
        children: [
          {
            index: true, //do not need a path with index
            Component: GameList,
            loader: getGameList,
          },
          {
            path: ':id',
            Component: GameDetails,
            loader: ({ params }) => getGameDetails(params.id),
            action: getPlayId,
          },
          {
            path: 'register',
            Component: RegisterPlayer,
          },
        ],
      },
    ],
  },
]);*/
