import { markdownToBBCode, type ParserSettings } from '../utils/markdownToBBCode';
import { markdownToHtml } from '../utils/markdownToHtml';
import { bbcodeToHtml } from '../utils/bbcodeToHtml';

class EditorStore {
	markdownText = $state('');
	bbcodeText = $state('');
	mode = $state<'chat' | 'result'>('result');

	settings = $state<ParserSettings>({
		headings: true,
		lists: true,
		tables: true,
		quotes: true,
		formatting: true,
		links: true,
		images: true,
		code: true,
		spoilers: true,
		hr: true
	});

	markdownPreviewHtml = $derived.by(() => markdownToHtml(this.markdownText));
	bbcodePreviewHtml = $derived.by(() => bbcodeToHtml(this.bbcodeText));

	syncBBCode() {
		const md = this.markdownText;
		const s = this.settings;
		const isChat = this.mode === 'chat';
		const config = {
			headings: s.headings,
			lists: isChat ? false : s.lists,
			tables: isChat ? false : s.tables,
			quotes: s.quotes,
			formatting: s.formatting,
			links: s.links,
			images: s.images,
			code: s.code,
			spoilers: isChat ? false : s.spoilers,
			hr: isChat ? false : s.hr
		};
		const converted = markdownToBBCode(md, config);
		this.bbcodeText = converted;
	}
}

export const editorStore = new EditorStore();
