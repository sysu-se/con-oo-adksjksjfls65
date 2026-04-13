import { Sudoku } from '../models/sudoku'; // 注意这里变小写了
import { Game } from '../models/game';     // 注意这里变小写了

export function createSudoku(grid) {
    return new Sudoku(grid);
}

export function createGame() {
    return new Game();
}
