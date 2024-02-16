// Copyright 2024 Josilyn McGuinness
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
import { useLoaderData } from 'react-router-dom'; //kick the worker off before actually loading page
import { Game } from '@jmcguinness/model';

const PreLoaded = () => {
  const games = useLoaderData() as Array<Game>;
  return (
    <ul>
      {games.map((g) => (
        <li>{g.name}</li>
      ))}
    </ul>
  );
};

export default PreLoaded;
