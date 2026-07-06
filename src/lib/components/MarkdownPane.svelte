<script lang="ts">
	import { editorStore } from '$lib/stores/editor.svelte';
	import MonacoEditor from './MonacoEditor.svelte';

	let isPreview = $state(false);
</script>

<div class="pane-container">
	<div class="pane-header">
		<div class="tabs">
			<button class:active={!isPreview} onclick={() => (isPreview = false)}>Markdown Source</button>
			<button class:active={isPreview} onclick={() => (isPreview = true)}>HTML Preview</button>
		</div>
	</div>
	<div class="pane-content">
		{#if !isPreview}
			<div class="editor-wrapper">
				<MonacoEditor
					bind:value={editorStore.markdownText}
					language="markdown"
					options={{ minimap: { enabled: false }, wordWrap: 'on' }}
				/>
			</div>
		{:else}
			<div class="preview-content ui-typography-container">
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				{@html editorStore.markdownPreviewHtml}
			</div>
		{/if}
	</div>
</div>

<style>
	.pane-container {
		display: flex;
		flex-direction: column;
		height: 100%;
		width: 100%;
	}
	.pane-header {
		padding: 8px;
		background-color: #f3f4f6;
		border-bottom: 1px solid #e5e7eb;
	}
	.tabs button {
		padding: 6px 16px;
		margin-right: 8px;
		cursor: pointer;
		background: white;
		border: 1px solid #d1d5db;
		border-radius: 4px;
		font-size: 14px;
	}
	.tabs button.active {
		background: #3b82f6;
		color: white;
		border-color: #3b82f6;
	}
	.pane-content {
		flex: 1;
		overflow: auto;
		position: relative;
		background-color: white;
	}
	.editor-wrapper {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
	}
	.preview-content {
		padding: 16px;
		background: white;
		height: 100%;
	}
</style>
