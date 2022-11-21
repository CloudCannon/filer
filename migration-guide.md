# Migration from collections.js to Filer

## Initialising

New
```
import Filer from '@cloudcannon/filer';
const filer = new Filer({ path: 'content' });
```

## Getting slugs for Next.js

Old
```
await getCollectionSlugs('posts');
```

New
```
(await filer.listItemSlugs('posts')).map((slug) => ({ params: { slug } }));
```


## Getting all parsed items in collection

Old
```
getCollection('posts');
getCollection('posts', { excerpt: true, sortKey: 'date' });
```

New
```
filer.getItems('posts');
filer.getItems('posts', { excerpt: true, sortKey: 'date' });
```


## Getting one parsed item in collection

Old
```
// Assumes slug ends with .md
getCollectionItem('posts', 'my-example-post');
getCollectionItem('posts', 'my-example-post', { excerpt: true });
```

New
```
filer.getItem('my-example-post.md', { folder: 'posts' });
const item = filer.getItem('my-example-post.md', {
	folder: 'posts',
	excerpt: true
});

const oldItem = { // The return result has changed - front matter now in data
	...item.data,
	slug: item.slug
};
```