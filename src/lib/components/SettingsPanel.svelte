<script lang="ts">
	import { editorStore } from '$lib/stores/editor.svelte';
</script>

<div class="settings-panel">
	<div class="settings-header">
		<div class="settings-title">Parser Features</div>
		<div class="mode-selector">
			<span class="mode-label">Mode:</span>
			<div class="mode-toggle">
				<button
					class="mode-btn"
					class:active={editorStore.mode === 'chat'}
					onclick={() => (editorStore.mode = 'chat')}
				>
					Chat
				</button>
				<button
					class="mode-btn"
					class:active={editorStore.mode === 'result'}
					onclick={() => (editorStore.mode = 'result')}
				>
					Result
				</button>
			</div>
		</div>
	</div>
	<div class="settings-grid">
		<label class="setting-item">
			<input type="checkbox" bind:checked={editorStore.settings.headings} />
			Headings
		</label>
		<label class="setting-item" class:disabled={editorStore.mode === 'chat'}>
			<input
				type="checkbox"
				checked={editorStore.mode === 'chat' ? false : editorStore.settings.lists}
				disabled={editorStore.mode === 'chat'}
				onchange={(e) => (editorStore.settings.lists = e.currentTarget.checked)}
			/>
			Lists
		</label>
		<label class="setting-item" class:disabled={editorStore.mode === 'chat'}>
			<input
				type="checkbox"
				checked={editorStore.mode === 'chat' ? false : editorStore.settings.tables}
				disabled={editorStore.mode === 'chat'}
				onchange={(e) => (editorStore.settings.tables = e.currentTarget.checked)}
			/>
			Tables
		</label>
		<label class="setting-item">
			<input type="checkbox" bind:checked={editorStore.settings.quotes} />
			Quotes
		</label>
		<label class="setting-item">
			<input type="checkbox" bind:checked={editorStore.settings.formatting} />
			Formatting (B/I/S/U)
		</label>
		<label class="setting-item">
			<input type="checkbox" bind:checked={editorStore.settings.links} />
			Links
		</label>
		<label class="setting-item">
			<input type="checkbox" bind:checked={editorStore.settings.images} />
			Images
		</label>
		<label class="setting-item">
			<input type="checkbox" bind:checked={editorStore.settings.code} />
			Code Blocks
		</label>
		<label class="setting-item" class:disabled={editorStore.mode === 'chat'}>
			<input
				type="checkbox"
				checked={editorStore.mode === 'chat' ? false : editorStore.settings.spoilers}
				disabled={editorStore.mode === 'chat'}
				onchange={(e) => (editorStore.settings.spoilers = e.currentTarget.checked)}
			/>
			Spoilers
		</label>
		<label class="setting-item" class:disabled={editorStore.mode === 'chat'}>
			<input
				type="checkbox"
				checked={editorStore.mode === 'chat' ? false : editorStore.settings.hr}
				disabled={editorStore.mode === 'chat'}
				onchange={(e) => (editorStore.settings.hr = e.currentTarget.checked)}
			/>
			Separators (HR)
		</label>
	</div>
</div>

<style>
	.settings-panel {
		background-color: #f8f9fa;
		border-bottom: 1px solid #e1e3e1;
		padding: 12px 24px;
	}
	.settings-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 12px;
	}
	.settings-title {
		font-size: 0.75rem;
		font-weight: 500;
		color: #444746;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		font-family: 'Google Sans', Roboto, sans-serif;
	}
	.mode-selector {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.mode-label {
		font-size: 0.75rem;
		font-weight: 500;
		color: #444746;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		font-family: 'Google Sans', Roboto, sans-serif;
	}
	.mode-toggle {
		display: flex;
		border-radius: 9999px;
		background: #e1e3e1;
		padding: 3px;
		gap: 2px;
	}
	.mode-btn {
		background: transparent;
		border: none;
		padding: 4px 16px;
		font-size: 0.75rem;
		font-weight: 500;
		font-family: 'Google Sans', Roboto, sans-serif;
		cursor: pointer;
		color: #1f1f1f;
		border-radius: 9999px;
		transition:
			background-color 0.2s,
			color 0.2s;
	}
	.mode-btn:hover:not(.active) {
		background-color: rgba(0, 0, 0, 0.06);
	}
	.mode-btn.active {
		background-color: #0b57d0;
		color: white;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
	}
	.settings-grid {
		display: flex;
		flex-wrap: wrap;
		gap: 16px;
	}
	.setting-item {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 0.875rem;
		color: #1f1f1f;
		font-family: 'Roboto', sans-serif;
		cursor: pointer;
		transition: opacity 0.2s;
	}
	.setting-item.disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}
	.setting-item.disabled input {
		cursor: not-allowed;
	}
	.setting-item input {
		cursor: pointer;
		accent-color: #0b57d0;
		width: 16px;
		height: 16px;
	}
</style>
