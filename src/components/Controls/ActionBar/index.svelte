<script>
	import Timer from './Timer.svelte';
	import Actions from './Actions.svelte';
	import { gameStore } from '../../../stores/gameStore';
</script>

<div class="action-bar space-y-3 xs:space-y-0" class:opacity-50={$gameStore.isPaused}>
	<Timer paused={$gameStore.isPaused} />

	<Actions />
</div>

<style>
	/* 保持原样 */
</style>
