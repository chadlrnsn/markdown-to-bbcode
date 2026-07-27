<script lang="ts">
	/* eslint-disable no-useless-assignment */
	import { onMount, onDestroy } from 'svelte';
	import loader from '@monaco-editor/loader';
	import type { editor as MonacoEditorInterface } from 'monaco-editor';

	let {
		value = $bindable(''),
		language = 'plaintext',
		readOnly = false,
		options = {},
		editor = $bindable(null)
	}: {
		value?: string;
		language?: string;
		readOnly?: boolean;
		options?: MonacoEditorInterface.IEditorOptions;
		editor?: MonacoEditorInterface.IStandaloneCodeEditor | null;
	} = $props();

	let containerEl: HTMLDivElement | null = null;
	let monacoInstance = $state<MonacoEditorInterface.IStandaloneCodeEditor | null>(null);

	onMount(async () => {
		if (!containerEl) return;

		const monaco = await loader.init();

		const instance = monaco.editor.create(containerEl, {
			value,
			language,
			theme: 'vs-light',
			readOnly,
			minimap: { enabled: false },
			wordWrap: 'on',
			automaticLayout: true,
			contextmenu: true,
			...options
		});

		monacoInstance = instance;
		editor = instance;

		instance.onDidChangeModelContent(() => {
			const val = instance.getValue() ?? '';
			if (val !== value) {
				value = val;
			}
		});

		// Helper to wrap selected text or toggle formatting
		const wrapSelection = (prefix: string, suffix: string = prefix, defaultPlaceholder = '') => {
			const selection = instance.getSelection();
			if (!selection) return;
			const model = instance.getModel();
			if (!model) return;

			const selectedText = model.getValueInRange(selection);

			// If text is already wrapped, unwrap it (toggle off)
			if (
				selectedText.startsWith(prefix) &&
				selectedText.endsWith(suffix) &&
				selectedText.length >= prefix.length + suffix.length
			) {
				const unwrapped = selectedText.slice(prefix.length, selectedText.length - suffix.length);
				instance.executeEdits('markdown-format', [
					{
						range: selection,
						text: unwrapped,
						forceMoveMarkers: true
					}
				]);
				return;
			}

			const textToWrap = selectedText || defaultPlaceholder;
			const replacement = `${prefix}${textToWrap}${suffix}`;

			instance.executeEdits('markdown-format', [
				{
					range: selection,
					text: replacement,
					forceMoveMarkers: true
				}
			]);

			if (selection.isEmpty() && defaultPlaceholder === '') {
				const position = selection.getStartPosition();
				instance.setPosition({
					lineNumber: position.lineNumber,
					column: position.column + prefix.length
				});
			}

			instance.focus();
		};

		// Helper to prefix lines (e.g., quotes, lists)
		const prefixLines = (prefix: string) => {
			const selection = instance.getSelection();
			if (!selection) return;
			const model = instance.getModel();
			if (!model) return;

			const startLine = selection.startLineNumber;
			const endLine = selection.endLineNumber;

			const edits = [];
			for (let i = startLine; i <= endLine; i++) {
				const lineContent = model.getLineContent(i);
				if (lineContent.startsWith(prefix)) {
					edits.push({
						range: new monaco.Range(i, 1, i, prefix.length + 1),
						text: ''
					});
				} else {
					edits.push({
						range: new monaco.Range(i, 1, i, 1),
						text: prefix
					});
				}
			}

			instance.executeEdits('markdown-format', edits);
			instance.focus();
		};

		// Register Context Menu actions and Keyboard Shortcuts (Hotkeys)
		if (language === 'markdown') {
			// Bold (Ctrl+B / Cmd+B)
			instance.addAction({
				id: 'markdown-bold',
				label: 'Format: Bold (**text**)',
				keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyB],
				contextMenuGroupId: '1_modification',
				contextMenuOrder: 1,
				run: () => wrapSelection('**')
			});

			// Italic (Ctrl+I / Cmd+I)
			instance.addAction({
				id: 'markdown-italic',
				label: 'Format: Italic (*text*)',
				keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyI],
				contextMenuGroupId: '1_modification',
				contextMenuOrder: 2,
				run: () => wrapSelection('*')
			});

			// Underline (Ctrl+U / Cmd+U)
			instance.addAction({
				id: 'markdown-underline',
				label: 'Format: Underline (<u>text</u>)',
				keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyU],
				contextMenuGroupId: '1_modification',
				contextMenuOrder: 3,
				run: () => wrapSelection('<u>', '</u>')
			});

			// Strikethrough (Ctrl+Shift+X)
			instance.addAction({
				id: 'markdown-strikethrough',
				label: 'Format: Strikethrough (~~text~~)',
				keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyX],
				contextMenuGroupId: '1_modification',
				contextMenuOrder: 4,
				run: () => wrapSelection('~~')
			});

			// Inline Code (Ctrl+`)
			instance.addAction({
				id: 'markdown-code-inline',
				label: 'Format: Inline Code (`code`)',
				keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Backquote],
				contextMenuGroupId: '1_modification',
				contextMenuOrder: 5,
				run: () => wrapSelection('`')
			});

			// Link (Ctrl+K / Cmd+K)
			instance.addAction({
				id: 'markdown-link',
				label: 'Format: Link ([text](url))',
				keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyK],
				contextMenuGroupId: '1_modification',
				contextMenuOrder: 6,
				run: () => wrapSelection('[', '](url)')
			});

			// Quote
			instance.addAction({
				id: 'markdown-quote',
				label: 'Format: Blockquote (> text)',
				contextMenuGroupId: '1_modification',
				contextMenuOrder: 7,
				run: () => prefixLines('> ')
			});

			// Code Block
			instance.addAction({
				id: 'markdown-code-block',
				label: 'Format: Code Block (```code```)',
				contextMenuGroupId: '1_modification',
				contextMenuOrder: 8,
				run: () => wrapSelection('```\n', '\n```')
			});
		} else {
			// BBCode formatting hotkeys and context menu
			instance.addAction({
				id: 'bbcode-bold',
				label: 'Format: Bold [B]',
				keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyB],
				contextMenuGroupId: '1_modification',
				contextMenuOrder: 1,
				run: () => wrapSelection('[B]', '[/B]')
			});

			instance.addAction({
				id: 'bbcode-italic',
				label: 'Format: Italic [I]',
				keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyI],
				contextMenuGroupId: '1_modification',
				contextMenuOrder: 2,
				run: () => wrapSelection('[I]', '[/I]')
			});

			instance.addAction({
				id: 'bbcode-underline',
				label: 'Format: Underline [U]',
				keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyU],
				contextMenuGroupId: '1_modification',
				contextMenuOrder: 3,
				run: () => wrapSelection('[U]', '[/U]')
			});

			instance.addAction({
				id: 'bbcode-link',
				label: 'Format: Link [URL]',
				keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyK],
				contextMenuGroupId: '1_modification',
				contextMenuOrder: 4,
				run: () => wrapSelection('[URL=url]', '[/URL]')
			});

			instance.addAction({
				id: 'bbcode-code',
				label: 'Format: Code Block [CODE]',
				keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Backquote],
				contextMenuGroupId: '1_modification',
				contextMenuOrder: 5,
				run: () => wrapSelection('[CODE]', '[/CODE]')
			});
		}
	});

	$effect(() => {
		if (monacoInstance) {
			const currentVal = monacoInstance.getValue();
			if (currentVal !== value) {
				monacoInstance.setValue(value || '');
			}
		}
	});

	$effect(() => {
		if (monacoInstance) {
			monacoInstance.updateOptions({ readOnly });
		}
	});

	onDestroy(() => {
		if (monacoInstance) {
			monacoInstance.dispose();
		}
	});
</script>

<div bind:this={containerEl} class="monaco-container-el"></div>

<style>
	.monaco-container-el {
		width: 100%;
		height: 100%;
	}
</style>
