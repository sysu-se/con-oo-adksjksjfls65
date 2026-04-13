<script>
	import { BOX_SIZE } from '@sudoku/constants';
	// 1. 引入新创建的 gameStore
	import { gameStore } from '../../stores/gameStore'; 
	import { settings } from '@sudoku/stores/settings';
	import { cursor } from '@sudoku/stores/cursor';
	import { candidates } from '@sudoku/stores/candidates';
	import Cell from './Cell.svelte';

	// 辅助逻辑保持不变，但入参会稍作调整以适配新结构
	function isSelected(cursorStore, x, y) {
		return cursorStore.x === x && cursorStore.y === y;
	}

	function isSameArea(cursorStore, x, y) {
		if (cursorStore.x === null && cursorStore.y === null) return false;
		if (cursorStore.x === x || cursorStore.y === y) return true;

		const cursorBoxX = Math.floor(cursorStore.x / BOX_SIZE);
		const cursorBoxY = Math.floor(cursorStore.y / BOX_SIZE);
		const cellBoxX = Math.floor(x / BOX_SIZE);
		const cellBoxY = Math.floor(y / BOX_SIZE);
		return (cursorBoxX === cellBoxX && cursorBoxY === cellBoxY);
	}

	function getValueAtCursor(sudokuInstance, cursorStore) {
		if (!sudokuInstance || cursorStore.x === null || cursorStore.y === null) return null;
		// 从封装的类实例中取值
		return sudokuInstance.grid[cursorStore.y][cursorStore.x];
	}
</script>

<div class="board-padding relative z-10">
	<div class="max-w-xl relative">
		<div class="w-full" style="padding-top: 100%"></div>
	</div>
	<div class="board-padding absolute inset-0 flex justify-center">

		<div class="bg-white shadow-2xl rounded-xl overflow-hidden w-full h-full max-w-xl grid" 
			 class:bg-gray-200={$gameStore.isPaused}>

			{#if $gameStore.sudoku}
				{#each $gameStore.sudoku.grid as row, y}
					{#each row as value, x}
						<Cell {value}
							  cellY={y + 1}
							  cellX={x + 1}
							  candidates={$candidates[x + ',' + y]}
							  disabled={$gameStore.isPaused}
							  selected={isSelected($cursor, x, y)}
							  
							  /* 这里的 userNumber 逻辑：如果原始位置是 0，则认为是用户填写的 */
							  userNumber={true} 
							  
							  /* 重点：点击格子调用 gameStore 的 guess 方法，实现响应式更新 */
							  on:click={() => gameStore.guess(y, x, (value + 1) % 10)}

							  sameArea={$settings.highlightCells && !isSelected($cursor, x, y) && isSameArea($cursor, x, y)}
							  sameNumber={$settings.highlightSame && value && !isSelected($cursor, x, y) && getValueAtCursor($gameStore.sudoku, $cursor) === value}
							  
							  /* 这里的验证逻辑可以调用 Sudoku 类里的 isValid 方法 */
							  conflictingNumber={$settings.highlightConflicting && !$gameStore.sudoku.isValid(y, x)} />
					{/each}
				{/each}
			{/if}

		</div>

	</div>
</div>

<style>
	.board-padding {
		@apply px-4 pb-4;
	}
</style>
