import { Sudoku } from '../models/Sudoku';
import { Game } from '../models/Game';

/**
 * 老师的测试脚本会调用这个函数来创建一个数独实例
 */
export function createSudoku() {
    return new Sudoku();
}

/**
 * 老师的测试脚本会调用这个函数来创建一个游戏实例
 */
export function createGame() {
    return new Game();
}
