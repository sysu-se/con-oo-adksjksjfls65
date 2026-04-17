# con-oo-adksjksjfls65 - Review

## Review 结论

当前实现有把 `Sudoku` / `Game` 抽成类并用 store 适配 Svelte 的方向感，但还没有达到作业要求的“真实接入”：`src/domain` 没有成为界面主入口，Svelte 层同时依赖多套状态和彼此对不上的 API，数独业务约束也没有被领域对象稳定承载。

## 总体评价

| 维度 | 评价 |
| --- | --- |
| OOP | fair |
| JS Convention | poor |
| Sudoku Business | poor |
| OOD | poor |

## 缺点

### 1. src/domain 没有成为真实游戏流程的入口

- 严重程度：core
- 位置：src/domain/index.js:1-22; src/App.svelte:10-23; src/components/Modal/Types/Welcome.svelte:3-24
- 原因：`src/domain/index.js` 只提供了薄工厂包装，而且在 `src` 内没有任何消费方；开始新局、胜负判断、暂停恢复等流程仍直接依赖旧的 `@sudoku/game` / `@sudoku/stores/game`。这不符合作业要求中“View 真正消费领域对象”的核心目标，也导致领域层没有成为单一事实来源。

### 2. Svelte 接入层的模块路径和导出契约彼此不一致

- 严重程度：core
- 位置：src/App.svelte:1-7; src/components/Board/index.svelte:4; src/components/Controls/Keyboard.svelte:3; src/components/Controls/ActionBar/Actions.svelte:4; src/components/Header/Buttons.svelte:3; src/components/Modal/Types/Welcome.svelte:3; src/node_modules/@sudoku/game.js:1-63
- 原因：`App.svelte` 在 `<script>` 外写了 JS；多个组件从 `@sudoku/game` 导入 `default`、`gameInstance`、`startNew`、`pauseGame` 等，但 `src/node_modules/@sudoku/game.js` 只导出了 `Game` 类；同时若按当前相对路径，组件引用的 `../../stores/gameStore` / `../../../stores/gameStore` 也不存在。这说明接入 API 没有收敛，静态上已经出现明显的编译/运行断裂。

### 3. 数独领域对象没有承载关键业务规则

- 严重程度：core
- 位置：src/node_modules/@sudoku/sudoku.js:6-36; src/components/Board/index.svelte:52-62
- 原因：`Sudoku.guess()` 只是直接改二维数组，没有检查坐标和数值范围、没有保护题面给定数字、也没有实现棋盘校验；但棋盘渲染又依赖 `isValid()`，并把所有格子都视为 `userNumber={true}`。这既违背数独业务，也说明 UI 对领域对象能力的假设与真实实现不一致。

### 4. 新旧状态源并存，开始游戏到获胜判断没有形成闭环

- 严重程度：core
- 位置：src/App.svelte:12-23; src/node_modules/@sudoku/stores/gameStore.js:17-21; src/node_modules/@sudoku/stores/game.js:7-18; src/components/Controls/ActionBar/Timer.svelte:2-9; src/node_modules/@sudoku/stores/keyboard.js:6-10
- 原因：棋盘显示来自 `$gameStore.sudoku.grid`，但胜利判断、暂停状态、键盘禁用等仍来自旧的 `userGrid` / `gamePaused` 派生 store；`gameStore.guess()` 也不会同步这些旧 store。结果是 UI 不同区域观察的是不同状态，真实游戏流程没有统一走同一个领域模型。

### 5. 适配层绕过了 Game 的公开接口和暂停约束

- 严重程度：major
- 位置：src/node_modules/@sudoku/stores/gameStore.js:18-21; src/node_modules/@sudoku/game.js:16-27
- 原因：`gameStore.guess()` 直接调用 `gameInstance.makeMove()`，而不是 `gameInstance.guess()`。这样 `Game.guess()` 中的暂停保护被绕开，store 直接依赖内部实现细节，破坏了 OOP 封装边界，也让领域规则更难集中维护。

### 6. Undo/Redo 设计只做了一半

- 严重程度：major
- 位置：src/domain/index.js:18-21; src/node_modules/@sudoku/game.js:46-50; src/components/Controls/ActionBar/Actions.svelte:38
- 原因：`Game.toJSON()` 序列化了 `history` 和 `redoStack`，但 `createGameFromJSON()` 只恢复当前 `sudoku`，历史状态被直接丢弃；同时 UI 中 redo 按钮永久禁用。说明撤销/重做虽然在类里有雏形，但没有形成一致的持久化与界面能力。

### 7. 棋盘事件没有按 Svelte 组件事件模型正确接线

- 严重程度：major
- 位置：src/components/Board/Cell.svelte:39; src/components/Board/index.svelte:55-56
- 原因：`Cell.svelte` 把 `cursor.set(cellX - 1, cellY - 1)` 写成了立即求值表达式，而不是点击回调；组件内部也没有显式转发 click 事件。与此同时 `Board` 又在 `<Cell>` 上绑定 `on:click` 试图触发 `gameStore.guess(...)`。静态上看，选中格子和填数都没有可靠地通过组件事件闭环。

### 8. 领域对象暴露了过多可变内部状态

- 严重程度：minor
- 位置：src/domain/index.js:13-20; src/node_modules/@sudoku/sudoku.js:13-15; src/components/Board/index.svelte:26-29,43-62
- 原因：`createGame()` / `createGameFromJSON()` 直接写 `game.sudoku`，View 也直接读取 `sudoku.grid`；`Sudoku.getGrid()` 还直接返回内部数组本身。对象有类的外形，但缺少稳定的只读视图或命令式 API，UI 很容易退化回“直接读写二维数组”的过程式写法。

## 优点

### 1. 对棋盘快照做了防御性拷贝

- 位置：src/node_modules/@sudoku/sudoku.js:6-10,38-40,65-66
- 原因：构造函数、`toJSON()` 和 `clone()` 都复制了二维数组，避免当前盘面和历史快照共享引用，这是 Undo/Redo 能成立的必要基础。

### 2. Undo/Redo 的职责被集中在 Game 中

- 位置：src/node_modules/@sudoku/game.js:21-40
- 原因：`Game` 自己维护 `history` / `redoStack` 并提供 `undo()` / `redo()`，方向上优于把状态回退逻辑散落在多个 `.svelte` 组件里。

### 3. 意识到了类实例需要通过 store 显式触发 Svelte 更新

- 位置：src/node_modules/@sudoku/stores/gameStore.js:4-36
- 原因：适配层把可变 `Game` 实例包进 `writable`，并在每次命令后显式 `set(gameInstance)`，说明作者理解了“只改对象内部字段不会自动刷新 UI”的 Svelte 响应式特点。

### 4. 为创建和反序列化预留了统一工厂入口

- 位置：src/domain/index.js:4-21
- 原因：`createSudoku*` / `createGame*` 把“实例化”和“从 JSON 恢复”集中在一个入口里，至少在结构上比让组件直接 `new` 领域对象更接近可维护的适配层设计。

## 补充说明

- 本次结论完全基于静态阅读；按要求没有运行 test，也没有实际启动 Svelte 应用。
- 关于“会编译失败/运行断裂/事件不生效”的判断，来自静态比对 import/export、Svelte 语法和方法定义，例如 `@sudoku/game` 的导出形态、`Sudoku.isValid()` 缺失、`Cell.svelte` 的事件绑定写法。
- 虽然评审入口限定为 `src/domain/*` 及其 Svelte 接入，但 `src/domain/index.js` 本身只是包装层，因此与领域设计直接相关的判断同时参考了它实际包装和接入的 `src/node_modules/@sudoku/game.js`、`src/node_modules/@sudoku/sudoku.js` 以及消费这些对象的 Svelte 组件。
