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
		background-color: rgba(0, 0, 0, 0.4);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1000;
		backdrop-filter: blur(4px);
	}

	.modal-container {
		background-color: white;
		width: 90%;
		max-width: 500px;
		max-height: 80vh;
		border-radius: 28px;
		display: flex;
		flex-direction: column;
		box-shadow:
			0 14px 28px rgba(0, 0, 0, 0.15),
			0 10px 10px rgba(0, 0, 0, 0.1);
	}

	.modal-header {
		padding: 24px 24px 16px;
		border-bottom: 1px solid #e1e3e1;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.modal-header h3 {
		margin: 0;
		font-size: 1.25rem;
		font-family: 'Google Sans', Roboto, sans-serif;
		font-weight: 500;
		color: #1f1f1f;
	}

	.close-btn {
		background: transparent;
		border: none;
		font-size: 1.5rem;
		cursor: pointer;
		color: #444746;
		line-height: 1;
		border-radius: 50%;
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: background-color 0.2s;
	}

	.close-btn:hover {
		background-color: rgba(0, 0, 0, 0.06);
		color: #1f1f1f;
	}

	.modal-body {
		padding: 24px;
		overflow-y: auto;
		flex: 1;
		font-family: 'Roboto', sans-serif;
	}

	.modal-footer {
		padding: 16px 24px 24px;
		border-top: 1px solid #e1e3e1;
		display: flex;
		justify-content: flex-end;
	}

	.primary-btn {
		background-color: #0b57d0;
		color: white;
		border: none;
		padding: 10px 24px;
		border-radius: 9999px;
		font-weight: 500;
		font-family: 'Google Sans', Roboto, sans-serif;
		cursor: pointer;
		transition:
			background-color 0.2s,
			box-shadow 0.2s;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
	}

	.primary-btn:hover {
		background-color: #0842a0;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
	}
</style>
