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
		padding: 8px 16px;
		background-color: #f8f9fa;
		border-bottom: 1px solid #e1e3e1;
	}
	.tabs button {
		padding: 6px 16px;
		margin-right: 8px;
		cursor: pointer;
		background: #e1e3e1;
		border: none;
		border-radius: 9999px;
		font-size: 13px;
		font-weight: 500;
		font-family: 'Google Sans', Roboto, sans-serif;
		color: #1f1f1f;
		transition: all 0.2s ease;
	}
	.tabs button:hover:not(.active) {
		background: #d3d5d3;
	}
	.tabs button.active {
		background: #0b57d0;
		color: white;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
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
