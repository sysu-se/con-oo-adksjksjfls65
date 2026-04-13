import { Sudoku } from '../node_modules/@sudoku/sudoku';
import { Game } from '../node_modules/@sudoku/game';

export function createSudoku(grid) { return new Sudoku(grid); }
export function createGame() { return new Game(); }
