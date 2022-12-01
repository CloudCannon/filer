import { readdir, readFile } from 'fs/promises';
import { basename, extname, join } from 'path';
import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt({ html: true });
const slugify = (filename) => basename(filename, extname(filename));
const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
export default class Filer {
	constructor({ path }) {
		this.path = path;
	}

	async listCollections() {
		return await readdir(this.path);
	}

	async listItemSlugs(folder) {
		const filenames = await readdir(join(this.path, folder));
		return filenames.map(slugify);
	}

	async getItems(folder, options) {
		const filenames = await readdir(join(this.path, folder));

		const items = await filenames.reduce(async (memoPromise, filename) => {
			if (!filename.startsWith('_')) {
				const item = await this.getItem(filename, { ...options, folder });
				const memo = await memoPromise;
				memo.unshift(item);
				return memo;
			}

			return memoPromise;
		}, []);

		if (options?.sortKey) {
			return items.sort((a, b) => {
				if (a.data[options?.sortKey] === b.data[options?.sortKey]) {
					return 0;
				}

				return a.data[options?.sortKey] > b.data[options?.sortKey] ? -1 : 1;
			});
		}

		return items;
	}

	async getPaginatedItems(folder, options) {
		const { pagination } = options;
		const items = await this.getItems(folder, options);

		const numberOfItems = items.length;
		const pageSize = pagination.size || numberOfItems;
		const numberOfPages = Math.ceil(numberOfItems / pageSize);
		const pageNumber = clamp(pagination.page || 1, 0, numberOfPages);
		const prevPage = pageNumber - 1;
		const nextPage = pageNumber + 1;

		const indexStart = (pageSize * (pageNumber - 1));
		const indexEnd = clamp(indexStart + pageSize, indexStart, numberOfItems);
		const pagedItems = items.slice(indexStart, indexEnd);

		const paginationDetails = {
			data: pagedItems,
			start: indexStart,
			end: indexEnd - 1,
			total: numberOfItems,
			currentPage: pageNumber,
			size: pagedItems.length,
			lastPage : numberOfPages,
		};

		if (prevPage > 0) {
			paginationDetails.prevPage = prevPage;
		}
		if (nextPage <= numberOfPages) {
			paginationDetails.nextPage = nextPage;
		}
		return paginationDetails;
	}

	async getItem(filename, options) {
		const fullPath = join(this.path, options?.folder || '', filename);
		const parsed = matter(await readFile(fullPath, 'utf8'));

		const item = {
			content: parsed.content,
			content_html: parsed.data.content_html || md.render(parsed.content || ''),
			data: parsed.data,
			slug: slugify(filename)
		};

		if (options?.excerpt) {
			item.excerpt_html = parsed.data.excerpt_html
				|| md.renderInline(parsed.content.split('\n').slice(1, 2).join(' '));
		}

		return item;
	}
}
