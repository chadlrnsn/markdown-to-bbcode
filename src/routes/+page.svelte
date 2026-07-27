<script lang="ts">
	import { onMount } from 'svelte';
	import SplitLayout from '$lib/components/SplitLayout.svelte';
	import MarkdownPane from '$lib/components/MarkdownPane.svelte';
	import BBCodePane from '$lib/components/BBCodePane.svelte';
	import SettingsPanel from '$lib/components/SettingsPanel.svelte';
	import UpdatesModal from '$lib/components/UpdatesModal.svelte';
	import { appStore } from '$lib/stores/app.svelte';
	import { editorStore } from '$lib/stores/editor.svelte';

	onMount(() => {
		appStore.fetchChangelog();
	});

	$effect(() => {
		editorStore.syncBBCode();
	});
</script>

<div class="app-container">
	<header class="app-header">
		<h1>Markdown to Bitrix BBCode</h1>
		<div class="header-links">
			<button class="update-btn" title="Что нового?" onclick={() => appStore.openModal()}>
				<svg height="24" viewBox="0 0 24 24" width="24" fill="currentColor">
					<path
						d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
					/>
				</svg>
			</button>
			<a
				href="https://github.com/chadlrnsn/markdown-to-bbcode"
				target="_blank"
				rel="noopener"
				class="repo-link"
				title="GitHub Repository"
			>
				<svg height="24" viewBox="0 0 16 16" width="24" fill="currentColor"
					><path
						d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
					></path></svg
				>
			</a>
			<a
				href="https://github.com/chadlrnsn"
				target="_blank"
				rel="noopener"
				class="profile-link"
				title="Creator Profile"
			>
				<img src="https://github.com/chadlrnsn.png" alt="chadlrnsn" class="avatar" />
			</a>
		</div>
	</header>
	<SettingsPanel />
	<main class="app-main">
		<SplitLayout>
			{#snippet left()}
				<MarkdownPane />
			{/snippet}
			{#snippet right()}
				<BBCodePane />
			{/snippet}
		</SplitLayout>
	</main>
	<UpdatesModal />
</div>

<style>
	.app-container {
		display: flex;
		flex-direction: column;
		height: 100vh;
		width: 100vw;
		overflow: hidden;
	}

	.app-header {
		padding: 12px 24px;
		background-color: #0b57d0;
		color: white;
		display: flex;
		justify-content: space-between;
		align-items: center;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
	}

	.header-links {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.repo-link,
	.profile-link,
	.update-btn {
		color: rgba(255, 255, 255, 0.85);
		transition: all 0.2s ease;
		display: flex;
		align-items: center;
		justify-content: center;
		background: none;
		border: none;
		padding: 6px;
		border-radius: 9999px;
		cursor: pointer;
	}

	.repo-link:hover,
	.update-btn:hover {
		color: white;
		background-color: rgba(255, 255, 255, 0.15);
	}

	.avatar {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		border: 2px solid transparent;
		transition: border-color 0.2s;
	}

	.profile-link:hover .avatar {
		border-color: #d3e3fd;
	}

	.app-header h1 {
		margin: 0;
		font-size: 1.25rem;
		font-weight: 500;
		font-family: 'Google Sans', Roboto, sans-serif;
		letter-spacing: -0.01em;
	}

	.app-main {
		flex: 1;
		overflow: hidden;
	}
</style>
