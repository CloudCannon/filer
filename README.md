# Filer

Provides an API for accessing parsed file content in a collection-like file structure.

[<img src="https://img.shields.io/npm/v/@cloudcannon%2Ffiler?logo=npm" alt="version badge">](https://www.npmjs.com/package/@cloudcannon%2Ffiler)
[<img src="https://img.shields.io/npm/dt/@cloudcannon%2Ffiler" alt="downloads badge">](https://www.npmjs.com/package/@cloudcannon%2Ffiler)

***

- [Installation](#installation)
- [Usage](#usage)
- [Development](#development)
- [License](#license)

***

## Installation

```bash
npm i @cloudcannon/filer
```

***

## Usage

JavaScript-based SSGs often have no standard approach to reading content from local files. This package aims to address this.

This package assumes a file structure where files are grouped into top-level folders called collections.
This mimics the file structure seen in a number of SSGs with standard approaches to reading local files.

Here's an example file tree with three collections inside a `content` folder:

```
content
├── pages
│   ├── about.md
│   └── index.md
├── posts
│   ├── my-first-post.md
│   ├── another-post.md
│   └── my-last-post-ever.md
└── authors
    ├── jane.md
    └── john.md
```

> At the moment, this is limited to Markdown files only.

### Setup

Where these functions are called depends on the SSG you are using.
This package simply wraps file reading and parsing into a consistent API.

```javascript
import Filer from '@cloudcannon/filer';
const filer = new Filer({
  path: 'content' // The base path containing your collection folders
});
```

### Getting all parsed items in collection

```javascript
// Can be called with no options
await filer.getItems('posts');

await filer.getItems('posts', {
  excerpt: true, // Produces excerpts/summaries from the first paragraph of content for each item
  sortKey: 'date' // Sorts items from this parsed data
});
```

### Getting one parsed item in collection

```javascript
await filer.getItem('my-first-post.md', { folder: 'posts' });

await filer.getItem('my-first-post.md', {
  folder: 'posts', // Reads the file from this folder/collection
  excerpt: true // Produces excerpts/summaries from the first paragraph of content
});
```

### Listing slugs for a collection

This is useful for providing Next.js with static paths.

```javascript
await filer.listItemSlugs('posts');
```

***

## Development

Install dependencies:

```sh
$ npm i
```

Run tests:

```sh
$ npm test
$ npm run test:watch
$ npm run test:coverage
```

Lint code:

```sh
$ npm run lint
```

Link this package locally to test it on a site folder, then run it within your site folder:

```sh
$ npm link
$ cd ../my-ssg-site
$ cloudcannon-reader
```

## License

ISC
