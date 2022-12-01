import test from 'ava';
import Filer from '../src/index.js';

const filer = new Filer({ path: 'tests/fixtures' });

test('lists collections', async (t) => {
	const collections = await filer.listCollections();
	t.deepEqual(collections, ['pages', 'people', 'posts']);
});

test('lists item slugs', async (t) => {
	const people = await filer.listItemSlugs('people');
	t.deepEqual(people, ['jane', 'john']);
});

test('gets items', async (t) => {
	const people = await filer.getItems('people');
	t.deepEqual(people, [
		{
			content: '\nAn example person.\n',
			content_html: '<p>An example person.</p>\n',
			data: {
				bio: 'Loves long walks on the beach',
				department: 'Marketing',
				name: 'John Doe',
				favourite_letter: 'A'
			},
			slug: 'john'
		},
		{
			content: '\nAn example person.\n',
			content_html: '<p>An example person.</p>\n',
			data: {
				bio: 'Has 25 pet dogs',
				department: 'Engineering',
				name: 'Jane Doe',
				favourite_letter: 'Z'
			},
			slug: 'jane'
		}
	]);
});

test('gets items sorted', async (t) => {
	const people = await filer.getItems('people', { sortKey: 'favourite_letter' });
	t.deepEqual(people, [
		{
			content: '\nAn example person.\n',
			content_html: '<p>An example person.</p>\n',
			data: {
				bio: 'Has 25 pet dogs',
				department: 'Engineering',
				name: 'Jane Doe',
				favourite_letter: 'Z'
			},
			slug: 'jane'
		},
		{
			content: '\nAn example person.\n',
			content_html: '<p>An example person.</p>\n',
			data: {
				bio: 'Loves long walks on the beach',
				department: 'Marketing',
				name: 'John Doe',
				favourite_letter: 'A'
			},
			slug: 'john'
		}
	]);
});

test('gets items sorted in reverse order', async (t) => {
	const people = await filer.getItems('people', { sortKey: 'favourite_letter', sortReverse: true });
	t.deepEqual(people, [
		{
			content: '\nAn example person.\n',
			content_html: '<p>An example person.</p>\n',
			data: {
				bio: 'Loves long walks on the beach',
				department: 'Marketing',
				name: 'John Doe',
				favourite_letter: 'A'
			},
			slug: 'john'
		},
		{
			content: '\nAn example person.\n',
			content_html: '<p>An example person.</p>\n',
			data: {
				bio: 'Has 25 pet dogs',
				department: 'Engineering',
				name: 'Jane Doe',
				favourite_letter: 'Z'
			},
			slug: 'jane'
		}
	]);
});

test('gets paginated items', async (t) => {
	const result = await filer.getPaginatedItems('posts',
		{ sortKey: 'date', pagination: { size: 2, page: 3 } });
	t.deepEqual(result, {
		data: [
			{
				content: '',
				content_html: '',
				data: {
					title: 'c',
					date: new Date('2022-01-03')

				},
				slug: 'c'
			},
			{
				content: '',
				content_html: '',
				data: {
					title: 'b',
					date: new Date('2022-01-02')

				},
				slug: 'b'
			}
		],
		start: 4,
		end: 5,
		total: 7,
		currentPage: 3,
		size: 2,
		lastPage: 4,
		nextPage: 4,
		prevPage: 2
	});
});

test('paginated items with page size greater than number of items', async (t) => {
	const result = await filer.getPaginatedItems('posts',
		{ sortKey: 'date', pagination: { size: 20, page: 3 } });
	t.deepEqual(result.data.length, 7);

	delete result.data;

	t.deepEqual(result, {
		start: 0,
		end: 6,
		total: 7,
		currentPage: 1,
		size: 7,
		lastPage: 1
	});
});

test('paginated items with page number greater than number of pages', async (t) => {
	const result = await filer.getPaginatedItems('posts',
		{ sortKey: 'date', pagination: { size: 2, page: 30 } });
	t.deepEqual(result, {
		data: [
			{
				content: '',
				content_html: '',
				data: {
					title: 'a',
					date: new Date('2022-01-01')

				},
				slug: 'a'
			}
		],
		start: 6,
		end: 6,
		total: 7,
		currentPage: 4,
		size: 1,
		lastPage: 4,
		prevPage: 3
	});
});


test('paginated items with page number less than 1', async (t) => {
	const result = await filer.getPaginatedItems('posts',
		{ sortKey: 'date', pagination: { size: 2, page: -1 } });
	t.deepEqual(result, {
		data: [
			{
				content: '',
				content_html: '',
				data: {
					title: 'g',
					date: new Date('2022-01-07')

				},
				slug: 'g'
			},
			{
				content: '',
				content_html: '',
				data: {
					title: 'f',
					date: new Date('2022-01-06')

				},
				slug: 'f'
			}
		],
		start: 0,
		end: 1,
		total: 7,
		currentPage: 1,
		size: 2,
		lastPage: 4,
		nextPage: 2
	});
});


test('gets item', async (t) => {
	const people = await filer.getItem('jane.md', { folder: 'people' });

	t.deepEqual(people, {
		content: '\nAn example person.\n',
		content_html: '<p>An example person.</p>\n',
		data: {
			bio: 'Has 25 pet dogs',
			department: 'Engineering',
			name: 'Jane Doe',
			favourite_letter: 'Z'
		},
		slug: 'jane'
	});
});

test('gets item with excerpt', async (t) => {
	const people = await filer.getItem('jane.md', {
		folder: 'people',
		excerpt: true
	});

	t.deepEqual(people, {
		content: '\nAn example person.\n',
		content_html: '<p>An example person.</p>\n',
		excerpt_html: 'An example person.',
		data: {
			bio: 'Has 25 pet dogs',
			department: 'Engineering',
			name: 'Jane Doe',
			favourite_letter: 'Z'
		},
		slug: 'jane'
	});
});
