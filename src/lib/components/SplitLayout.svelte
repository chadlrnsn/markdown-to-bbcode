<script lang="ts">
	import { onMount, type Snippet } from 'svelte';

	let { left, right }: { left: Snippet; right: Snippet } = $props();

	let splitPercent = $state(50);
	let isResizing = $state(false);
	let containerRef = $state<HTMLElement | null>(null);

	const startResizing = (event: MouseEvent) => {
		isResizing = true;
		event.preventDefault();
	};

	const stopResizing = () => {
		isResizing = false;
	};

	const resize = (event: MouseEvent) => {
		if (!isResizing || !containerRef) return;

		const containerRect = containerRef.getBoundingClientRect();
		const newWidth = event.clientX - containerRect.left;
		const percent = (newWidth / containerRect.width) * 100;

		if (percent > 10 && percent < 90) {
			splitPercent = percent;
		}
	};

	onMount(() => {
		window.addEventListener('mousemove', resize);
		window.addEventListener('mouseup', stopResizing);
		return () => {
			window.removeEventListener('mousemove', resize);
			window.removeEventListener('mouseup', stopResizing);
		};
	});
</script>

<div bind:this={containerRef} class="split-layout" class:is-resizing={isResizing}>
	<div class="split-pane left" style="width: {splitPercent}%">
		{@render left()}
	</div>
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="split-gutter" onmousedown={startResizing}>
		<div class="gutter-line"></div>
	</div>
	<div class="split-pane right" style="width: {100 - splitPercent}%">
		{@render right()}
	</div>
</div>

<style>
	.split-layout {
		display: flex;
		width: 100%;
		height: 100%;
		overflow: hidden;
	}

	.split-pane {
		height: 100%;
		overflow: hidden;
		position: relative;
	}

	.split-gutter {
		width: 8px;
		cursor: col-resize;
		background-color: #f3f4f6;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: background-color 0.2s;
		z-index: 10;
	}

	.split-gutter:hover,
	.is-resizing .split-gutter {
		background-color: #e5e7eb;
	}

	.gutter-line {
		width: 2px;
		height: 40px;
		background-color: #d1d5db;
		border-radius: 1px;
	}

	.is-resizing {
		cursor: col-resize;
	}

	.is-resizing .split-pane {
		pointer-events: none;
	}
</style>
