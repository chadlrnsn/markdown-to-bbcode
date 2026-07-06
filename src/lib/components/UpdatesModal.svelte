<script lang="ts">
	import { appStore } from '$lib/stores/app.svelte';
	import { fade, scale } from 'svelte/transition';
</script>

{#if appStore.isModalOpen}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		transition:fade={{ duration: 200 }}
		class="modal-backdrop"
		onclick={() => appStore.closeModal()}
	>
		<div
			transition:scale={{ duration: 250, start: 0.95 }}
			class="modal-container"
			onclick={(e) => e.stopPropagation()}
		>
			<div class="modal-header">
				<h3>Что нового в версии {appStore.currentVersion}</h3>
				<button class="close-btn" onclick={() => appStore.closeModal()}>&times;</button>
			</div>
			<div class="modal-body ui-typography-container">
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				{@html appStore.changelogHtml}
			</div>
			<div class="modal-footer">
				<button class="primary-btn" onclick={() => appStore.closeModal()}>Понятно</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1000;
		backdrop-filter: blur(2px);
	}

	.modal-container {
		background-color: white;
		width: 90%;
		max-width: 500px;
		max-height: 80vh;
		border-radius: 8px;
		display: flex;
		flex-direction: column;
		box-shadow:
			0 10px 25px -5px rgba(0, 0, 0, 0.1),
			0 8px 10px -6px rgba(0, 0, 0, 0.1);
	}

	.modal-header {
		padding: 16px 20px;
		border-bottom: 1px solid #eef2f4;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.modal-header h3 {
		margin: 0;
		font-size: 1.1rem;
		color: #333;
	}

	.close-btn {
		background: none;
		border: none;
		font-size: 1.5rem;
		cursor: pointer;
		color: #9ca3af;
		line-height: 1;
	}

	.close-btn:hover {
		color: #374151;
	}

	.modal-body {
		padding: 20px;
		overflow-y: auto;
		flex: 1;
	}

	.modal-footer {
		padding: 16px 20px;
		border-top: 1px solid #eef2f4;
		display: flex;
		justify-content: flex-end;
	}

	.primary-btn {
		background-color: #3b82f6;
		color: white;
		border: none;
		padding: 8px 24px;
		border-radius: 4px;
		font-weight: 500;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.primary-btn:hover {
		background-color: #2563eb;
	}
</style>
