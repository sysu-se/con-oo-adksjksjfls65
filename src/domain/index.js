// 注意这里的路径：从 domain 文件夹向上跳一级到 src，再进入那个特殊的 node_modules 目录
import { Sudoku } from '../node_modules/@sudoku/sudoku';
import { Game } from '../node_modules/@sudoku/game';

export function createSudoku(grid) {
    return new Sudoku(grid);
}

export function createGame() {
    return new Game();
}
