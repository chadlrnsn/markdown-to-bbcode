<script lang="ts">
	import { editorStore } from '$lib/stores/editor.svelte';
	import MonacoEditor from './MonacoEditor.svelte';
	import type { editor as MonacoEditorInterface } from 'monaco-editor';

	let isPreview = $state(false);
	let editorRef = $state<MonacoEditorInterface.IStandaloneCodeEditor | null>(null);

	let selectedColor = $state('#ff0000');
	let selectedSize = $state('');
	const sizes = ['12', '14', '16', '18', '20', '24', '30', '36'];

	let showTooltip = $state(false);
	let tooltipX = $state(0);
	let tooltipY = $state(0);

	$effect(() => {
		const editor = editorRef;
		if (editor) {
			const disposable = editor.onDidChangeCursorSelection(
				(e: MonacoEditorInterface.ICursorSelectionChangedEvent) => {
					const selection = e.selection;
					if (!selection.isEmpty()) {
						const position = editor.getScrolledVisiblePosition(selection.getEndPosition());
						if (position) {
							tooltipX = position.left;
							tooltipY = position.top - 40;
							showTooltip = true;
						}
					} else {
						showTooltip = false;
					}
				}
			);
			return () => {
				disposable.dispose();
			};
		}
	});

	const copyToClipboard = async () => {
		try {
			const text = editorStore.bbcodeText;
			const html = editorStore.bbcodePreviewHtml;

			const typeText = 'text/plain';
			const typeHtml = 'text/html';

			const blobText = new Blob([text], { type: typeText });
			const blobHtml = new Blob([html], { type: typeHtml });

			const data = [
				new ClipboardItem({
					[typeText]: blobText,
					[typeHtml]: blobHtml
				})
			];

			await navigator.clipboard.write(data);
			alert('Copied for Bitrix! Now you can paste it into the Bitrix editor.');
		} catch (err) {
			console.error('Failed to copy:', err);
			await navigator.clipboard.writeText(editorStore.bbcodeText);
			alert('Copied as plain text (formatting might not be preserved).');
		}
	};

	const applyFormat = (tag: string, value?: string) => {
		if (!editorRef) return;

		const selection = editorRef.getSelection();
		if (!selection) return;

		const text = editorRef.getModel()?.getValueInRange(selection) || '';
		const openTag = value ? `[${tag}=${value}]` : `[${tag}]`;
		const closeTag = `[/${tag}]`;

		const newText = `${openTag}${text}${closeTag}`;

		editorRef.executeEdits('toolbar', [
			{
				range: selection,
				text: newText,
				forceMoveMarkers: true
			}
		]);

		editorRef.focus();
	};
</script>

<div class="pane-container">
	<div class="pane-header">
		<div class="tabs">
			<button class:active={!isPreview} onclick={() => (isPreview = false)}>BBCode Source</button>
			<button class:active={isPreview} onclick={() => (isPreview = true)}>BBCode Preview</button>
		</div>

		<div class="actions">
			<button
				class="copy-button"
				onclick={copyToClipboard}
				title="Copy for Bitrix (Maintains formatting and spoilers)"
			>
				Copy for Bitrix
			</button>
		</div>

		<!-- {#if !isPreview}
			<div class="toolbar">
				<input
					type="color"
					bind:value={selectedColor}
					title="Text Color"
					onchange={() => applyFormat('COLOR', selectedColor)}
				/>
				<select bind:value={selectedSize} onchange={() => applyFormat('SIZE', selectedSize)}>
					<option value="" disabled selected>Size</option>
					{#each sizes as size (size)}
						<option value={size}>{size}px</option>
					{/each}
				</select>
				<button onclick={() => applyFormat('B')} title="Bold"><b>B</b></button>
				<button onclick={() => applyFormat('I')} title="Italic"><i>I</i></button>
				<button onclick={() => applyFormat('U')} title="Underline"><u>U</u></button>
			</div>
		{/if} -->
	</div>

	<div class="pane-content">
		{#if !isPreview}
			<div class="editor-wrapper">
				<MonacoEditor
					bind:value={editorStore.bbcodeText}
					language="plaintext"
					bind:editor={editorRef}
					options={{ minimap: { enabled: false }, wordWrap: 'on' }}
				/>
			</div>

			{#if showTooltip}
				<div class="floating-tooltip" style="top: {tooltipY}px; left: {tooltipX}px;">
					<button onclick={() => applyFormat('COLOR', selectedColor)} style="color: {selectedColor}"
						>Color</button
					>
					<button onclick={() => applyFormat('SIZE', selectedSize || '16')}>Size</button>
					<button onclick={() => applyFormat('B')}><b>B</b></button>
					<button onclick={() => applyFormat('U')}><u>U</u></button>
				</div>
			{/if}
		{:else}
			<div class="preview-content">
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				{@html editorStore.bbcodePreviewHtml}
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
		position: relative;
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
		margin-right: 6px;
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

	.actions {
		display: flex;
	}
	.copy-button {
		padding: 6px 16px;
		cursor: pointer;
		background: #137333;
		color: white;
		border: none;
		border-radius: 9999px;
		font-size: 13px;
		font-weight: 500;
		font-family: 'Google Sans', Roboto, sans-serif;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
		transition: all 0.2s ease;
	}
	.copy-button:hover {
		background: #0f5223;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
	}

	.toolbar {
		display: flex;
		align-items: center;
		gap: 8px;
		padding-left: 12px;
		border-left: 1px solid #e1e3e1;
	}
	.toolbar button,
	.toolbar select {
		padding: 4px 10px;
		cursor: pointer;
		background: white;
		border: 1px solid #c4c7c5;
		border-radius: 8px;
		font-size: 12px;
		font-family: 'Roboto', sans-serif;
		color: #1f1f1f;
		transition: border-color 0.2s;
	}
	.toolbar button:hover,
	.toolbar select:hover {
		border-color: #0b57d0;
	}
	.toolbar input[type='color'] {
		width: 30px;
		height: 24px;
		padding: 0;
		border: 1px solid #c4c7c5;
		border-radius: 4px;
		cursor: pointer;
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

	.floating-tooltip {
		position: absolute;
		z-index: 1000;
		background: #1f1f1f;
		color: white;
		padding: 4px 6px;
		border-radius: 8px;
		display: flex;
		gap: 4px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
	}
	.floating-tooltip button {
		background: transparent;
		color: white;
		border: none;
		padding: 4px 8px;
		cursor: pointer;
		font-size: 12px;
		font-family: 'Google Sans', Roboto, sans-serif;
		border-radius: 4px;
	}
	.floating-tooltip button:hover {
		background: rgba(255, 255, 255, 0.15);
	}
</style>
