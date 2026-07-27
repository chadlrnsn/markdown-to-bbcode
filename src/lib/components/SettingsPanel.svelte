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
			<div class="custom-checkbox">
				<input type="checkbox" bind:checked={editorStore.settings.headings} />
				<div class="checkbox-box">
					<svg class="checkmark" viewBox="0 0 24 24">
						<polyline points="20 6 9 17 4 12" />
					</svg>
				</div>
			</div>
			<span>Headings</span>
		</label>
		<label class="setting-item" class:disabled={editorStore.mode === 'chat'}>
			<div class="custom-checkbox">
				<input
					type="checkbox"
					checked={editorStore.mode === 'chat' ? false : editorStore.settings.lists}
					disabled={editorStore.mode === 'chat'}
					onchange={(e) => (editorStore.settings.lists = e.currentTarget.checked)}
				/>
				<div class="checkbox-box">
					<svg class="checkmark" viewBox="0 0 24 24">
						<polyline points="20 6 9 17 4 12" />
					</svg>
				</div>
			</div>
			<span>Lists</span>
		</label>
		<label class="setting-item" class:disabled={editorStore.mode === 'chat'}>
			<div class="custom-checkbox">
				<input
					type="checkbox"
					checked={editorStore.mode === 'chat' ? false : editorStore.settings.tables}
					disabled={editorStore.mode === 'chat'}
					onchange={(e) => (editorStore.settings.tables = e.currentTarget.checked)}
				/>
				<div class="checkbox-box">
					<svg class="checkmark" viewBox="0 0 24 24">
						<polyline points="20 6 9 17 4 12" />
					</svg>
				</div>
			</div>
			<span>Tables</span>
		</label>
		<label class="setting-item">
			<div class="custom-checkbox">
				<input type="checkbox" bind:checked={editorStore.settings.quotes} />
				<div class="checkbox-box">
					<svg class="checkmark" viewBox="0 0 24 24">
						<polyline points="20 6 9 17 4 12" />
					</svg>
				</div>
			</div>
			<span>Quotes</span>
		</label>
		<label class="setting-item">
			<div class="custom-checkbox">
				<input type="checkbox" bind:checked={editorStore.settings.formatting} />
				<div class="checkbox-box">
					<svg class="checkmark" viewBox="0 0 24 24">
						<polyline points="20 6 9 17 4 12" />
					</svg>
				</div>
			</div>
			<span>Formatting (B/I/S/U)</span>
		</label>
		<label class="setting-item">
			<div class="custom-checkbox">
				<input type="checkbox" bind:checked={editorStore.settings.links} />
				<div class="checkbox-box">
					<svg class="checkmark" viewBox="0 0 24 24">
						<polyline points="20 6 9 17 4 12" />
					</svg>
				</div>
			</div>
			<span>Links</span>
		</label>
		<label class="setting-item">
			<div class="custom-checkbox">
				<input type="checkbox" bind:checked={editorStore.settings.images} />
				<div class="checkbox-box">
					<svg class="checkmark" viewBox="0 0 24 24">
						<polyline points="20 6 9 17 4 12" />
					</svg>
				</div>
			</div>
			<span>Images</span>
		</label>
		<label class="setting-item">
			<div class="custom-checkbox">
				<input type="checkbox" bind:checked={editorStore.settings.code} />
				<div class="checkbox-box">
					<svg class="checkmark" viewBox="0 0 24 24">
						<polyline points="20 6 9 17 4 12" />
					</svg>
				</div>
			</div>
			<span>Code Blocks</span>
		</label>
		<label class="setting-item" class:disabled={editorStore.mode === 'chat'}>
			<div class="custom-checkbox">
				<input
					type="checkbox"
					checked={editorStore.mode === 'chat' ? false : editorStore.settings.spoilers}
					disabled={editorStore.mode === 'chat'}
					onchange={(e) => (editorStore.settings.spoilers = e.currentTarget.checked)}
				/>
				<div class="checkbox-box">
					<svg class="checkmark" viewBox="0 0 24 24">
						<polyline points="20 6 9 17 4 12" />
					</svg>
				</div>
			</div>
			<span>Spoilers</span>
		</label>
		<label class="setting-item" class:disabled={editorStore.mode === 'chat'}>
			<div class="custom-checkbox">
				<input
					type="checkbox"
					checked={editorStore.mode === 'chat' ? false : editorStore.settings.hr}
					disabled={editorStore.mode === 'chat'}
					onchange={(e) => (editorStore.settings.hr = e.currentTarget.checked)}
				/>
				<div class="checkbox-box">
					<svg class="checkmark" viewBox="0 0 24 24">
						<polyline points="20 6 9 17 4 12" />
					</svg>
				</div>
			</div>
			<span>Separators (HR)</span>
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
		user-select: none;
		transition: opacity 0.2s;
	}
	.setting-item.disabled {
		opacity: 0.38;
		cursor: not-allowed;
	}
	.setting-item.disabled .custom-checkbox input {
		cursor: not-allowed;
	}

	/* Custom Material 3 Checkbox */
	.custom-checkbox {
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 18px;
		height: 18px;
	}

	.custom-checkbox input[type='checkbox'] {
		position: absolute;
		opacity: 0;
		width: 100%;
		height: 100%;
		margin: 0;
		cursor: pointer;
		z-index: 2;
	}

	.checkbox-box {
		width: 18px;
		height: 18px;
		border: 2px solid #747775;
		border-radius: 4px;
		background-color: transparent;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
		box-sizing: border-box;
	}

	.custom-checkbox input[type='checkbox']:hover:not(:disabled) ~ .checkbox-box {
		border-color: #0b57d0;
		background-color: rgba(11, 87, 208, 0.08);
	}

	.custom-checkbox input[type='checkbox']:checked ~ .checkbox-box {
		background-color: #0b57d0;
		border-color: #0b57d0;
	}

	.custom-checkbox input[type='checkbox']:focus-visible ~ .checkbox-box {
		outline: 2px solid #0b57d0;
		outline-offset: 2px;
	}

	.checkmark {
		width: 13px;
		height: 13px;
		fill: none;
		stroke: white;
		stroke-width: 3.2;
		stroke-linecap: round;
		stroke-linejoin: round;
		opacity: 0;
		transform: scale(0.5);
		transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.custom-checkbox input[type='checkbox']:checked ~ .checkbox-box .checkmark {
		opacity: 1;
		transform: scale(1);
	}
</style>
