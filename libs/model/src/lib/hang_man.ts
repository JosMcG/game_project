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
import { LiteGameBuilder } from './model';

export const liteHangMan = new LiteGameBuilder()
  .setId('Hang-Man')
  .setName('Hang Man')
  .setDescription('Guess the word before you are hung!')
  .setImageURL('/public/hangman-gameImg.png')
  .addRule(
    'Guess a letter.',
    'If you are correct, the letter is placed in the correct position. \
	If you are incorrect, a body part gets hung.'
  )
  .addRule('Game end.', 'Try to guess the word before you meet your demise.')
  .buildGame();
