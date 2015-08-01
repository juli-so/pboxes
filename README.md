pBoxes
===

This is a project to support comments anywhere on the specific area of a page.
The comments will be displayed as colored boxes with hidden message boxes which will be shown when mouse hovered.

Frontend
---
Built as a [jQuery](http://jquery.com) plugin.

Usage:
``` javascript
$('body').pboxes({
  get: '/get',
  add: '/add',
  thumbup: '/thumbup',
}, {
  // getLoader: getLoaderHTML,
  getThumbIcon: function (hasThumb) {
    return hasThumbUp ? '已赞' : '赞';
  },
  error: console.log,
});
```

Backend
---
* **PHP**: No third party dependencies required

Todo
---
* Add backend for Python
