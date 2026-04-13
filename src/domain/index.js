import { Sudoku } from '../node_modules/@sudoku/sudoku';
import { Game } from '../node_modules/@sudoku/game';

export function createSudoku(grid) {
  return new Sudoku(grid);
}

export function createSudokuFromJSON(json) {
  return new Sudoku(json?.grid || json);
}

export function createGame(params) {
  const game = new Game();
  if (params?.sudoku) game.sudoku = params.sudoku;
  return game;
}

export function createGameFromJSON(json) {
  const game = new Game();
  if (json?.sudoku) game.sudoku = createSudokuFromJSON(json.sudoku);
  return game;
}
