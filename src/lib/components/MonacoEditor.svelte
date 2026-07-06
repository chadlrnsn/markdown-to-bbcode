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
