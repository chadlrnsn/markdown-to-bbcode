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
		background-color: #f9fafb;
		border-bottom: 1px solid #e5e7eb;
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
		font-weight: 600;
		color: #6b7280;
		text-transform: uppercase;
	}
	.mode-selector {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.mode-label {
		font-size: 0.75rem;
		font-weight: 600;
		color: #6b7280;
		text-transform: uppercase;
	}
	.mode-toggle {
		display: flex;
		border-radius: 4px;
		overflow: hidden;
		border: 1px solid #d1d5db;
	}
	.mode-btn {
		background: white;
		border: none;
		padding: 4px 12px;
		font-size: 0.75rem;
		font-weight: 500;
		cursor: pointer;
		color: #374151;
		transition:
			background-color 0.2s,
			color 0.2s;
	}
	.mode-btn:first-child {
		border-right: 1px solid #d1d5db;
	}
	.mode-btn:hover:not(.active) {
		background-color: #f3f4f6;
	}
	.mode-btn.active {
		background-color: #3b82f6;
		color: white;
	}
	.settings-grid {
		display: flex;
		flex-wrap: wrap;
		gap: 16px;
	}
	.setting-item {
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: 0.875rem;
		color: #374151;
		cursor: pointer;
		transition: opacity 0.2s;
	}
	.setting-item.disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	.setting-item.disabled input {
		cursor: not-allowed;
	}
	.setting-item input {
		cursor: pointer;
	}
</style>
