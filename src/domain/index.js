// src/domain/index.js
import { Sudoku } from '../node_modules/@sudoku/sudoku';
import { Game } from '../node_modules/@sudoku/game';

export function createSudoku(grid) {
    // 确保测试脚本传入 grid 时能正确初始化
    return new Sudoku(grid);
}

export function createGame() {
    // 这里 new 的是 Game 类
    return new Game();
}
