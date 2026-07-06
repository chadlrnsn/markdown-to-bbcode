import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkHtml from 'remark-html';
import { base } from '$app/paths';

class AppStore {
	currentVersion = $state('');
	lastViewedVersion = $state(
		typeof window !== 'undefined' ? localStorage.getItem('md_to_bbcode_last_version') || '' : ''
	);
	changelogHtml = $state('');
	isModalOpen = $state(false);
	isLoaded = $state(false);

	async fetchChangelog() {
		try {
			const baseUrl = base.replace(/\/$/, '');
			const changelogUrl = `${baseUrl}/CHANGELOG.md`;

			console.log(`Fetching changelog from ${changelogUrl}...`);
			const response = await fetch(changelogUrl);
			if (!response.ok) {
				throw new Error(`Changelog not found: ${response.status} ${response.statusText}`);
			}
			const markdown = await response.text();

			const versionMatch = markdown.match(/^#\s+(.*)/);
			this.currentVersion = versionMatch?.[1]?.split('\n')[0]?.trim() ?? '0.0.0';

			const file = unified().use(remarkParse).use(remarkHtml);
			const processed = await file.process(markdown);
			this.changelogHtml = String(processed);
			this.isLoaded = true;

			this.checkVersion();
		} catch (e) {
			console.error('Failed to fetch changelog:', e);
		}
	}

	checkVersion() {
		if (this.currentVersion && this.currentVersion !== this.lastViewedVersion) {
			this.isModalOpen = true;
		}
	}

	closeModal() {
		this.isModalOpen = false;
		this.lastViewedVersion = this.currentVersion;
		if (typeof window !== 'undefined') {
			localStorage.setItem('md_to_bbcode_last_version', this.currentVersion);
		}
	}

	openModal() {
		this.isModalOpen = true;
	}
}

export const appStore = new AppStore();
