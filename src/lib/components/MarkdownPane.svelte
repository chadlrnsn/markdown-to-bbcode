<script lang="ts">
	import { editorStore } from '$lib/stores/editor.svelte';
	import MonacoEditor from './MonacoEditor.svelte';
	import type { editor as MonacoEditorInterface } from 'monaco-editor';

	let isPreview = $state(false);
	let editorRef = $state<MonacoEditorInterface.IStandaloneCodeEditor | null>(null);

	const applyFormat = (type: string) => {
		if (!editorRef) return;
		const selection = editorRef.getSelection();
		if (!selection) return;

		const model = editorRef.getModel();
		if (!model) return;

		const selectedText = model.getValueInRange(selection);

		let prefix = '';
		let suffix = '';

		switch (type) {
			case 'B':
				prefix = '**';
				suffix = '**';
				break;
			case 'I':
				prefix = '*';
				suffix = '*';
				break;
			case 'U':
				prefix = '<u>';
				suffix = '</u>';
				break;
			case 'S':
				prefix = '~~';
				suffix = '~~';
				break;
			case 'CODE':
				prefix = '`';
				suffix = '`';
				break;
			case 'QUOTE':
				prefix = '> ';
				break;
		}

		if (prefix && suffix && selectedText.startsWith(prefix) && selectedText.endsWith(suffix)) {
			const unwrapped = selectedText.slice(prefix.length, selectedText.length - suffix.length);
			editorRef.executeEdits('toolbar-format', [{ range: selection, text: unwrapped, forceMoveMarkers: true }]);
		} else if (type === 'QUOTE') {
			const startLine = selection.startLineNumber;
			const endLine = selection.endLineNumber;
			const edits = [];
			for (let i = startLine; i <= endLine; i++) {
				const lineContent = model.getLineContent(i);
				if (lineContent.startsWith('> ')) {
					edits.push({ range: { startLineNumber: i, startColumn: 1, endLineNumber: i, endColumn: 3 }, text: '' });
				} else {
					edits.push({ range: { startLineNumber: i, startColumn: 1, endLineNumber: i, endColumn: 1 }, text: '> ' });
				}
			}
			editorRef.executeEdits('toolbar-format', edits);
		} else {
			const replacement = `${prefix}${selectedText || ''}${suffix}`;
			editorRef.executeEdits('toolbar-format', [{ range: selection, text: replacement, forceMoveMarkers: true }]);
		}

		editorRef.focus();
	};
</script>

<div class="pane-container">
	<div class="pane-header">
		<div class="tabs">
			<button class:active={!isPreview} onclick={() => (isPreview = false)}>Markdown Source</button>
			<button class:active={isPreview} onclick={() => (isPreview = true)}>HTML Preview</button>
		</div>

		{#if !isPreview}
			<div class="toolbar">
				<button onclick={() => applyFormat('B')} title="Bold (Ctrl+B)"><b>B</b></button>
				<button onclick={() => applyFormat('I')} title="Italic (Ctrl+I)"><i>I</i></button>
				<button onclick={() => applyFormat('U')} title="Underline (Ctrl+U)"><u>U</u></button>
				<button onclick={() => applyFormat('S')} title="Strikethrough (Ctrl+Shift+X)"><s>S</s></button>
				<button onclick={() => applyFormat('CODE')} title="Inline Code (Ctrl+`)"><code>&lt;&gt;</code></button>
				<button onclick={() => applyFormat('QUOTE')} title="Quote">&ldquo;&rdquo;</button>
			</div>
		{/if}
	</div>
	<div class="pane-content">
		{#if !isPreview}
			<div class="editor-wrapper">
				<MonacoEditor
					bind:value={editorStore.markdownText}
					bind:editor={editorRef}
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
		display: flex;
		align-items: center;
		gap: 16px;
	}
	.tabs {
		display: flex;
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

	.toolbar {
		display: flex;
		align-items: center;
		gap: 6px;
		padding-left: 12px;
		border-left: 1px solid #e1e3e1;
	}
	.toolbar button {
		padding: 4px 10px;
		cursor: pointer;
		background: white;
		border: 1px solid #c4c7c5;
		border-radius: 8px;
		font-size: 12px;
		font-family: 'Roboto', sans-serif;
		color: #1f1f1f;
		transition: all 0.2s ease;
	}
	.toolbar button:hover {
		border-color: #0b57d0;
		color: #0b57d0;
		background: rgba(11, 87, 208, 0.04);
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