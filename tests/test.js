import test from 'ava';
import Filer from '../src/index.js';

const filer = new Filer({ path: 'tests/fixtures' });

test('lists collections', async (t) => {
	const collections = await filer.listCollections();
	t.deepEqual(collections, ['pages', 'people']);
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
