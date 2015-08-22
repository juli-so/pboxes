pBoxes - JavaScript
===

This the JavaScript part of pBoxes. It is built as a [jQuery](http://jquery.com) plugin.

Usage
---
Load `dist/*.js` and `dist/*.css` into your HTML page.

*jqObj*.pboxes(*urls*, *callbacks*, *page_id*)

* `jqObj`: *required*  
  A jQuery object, selecting the element to contain pBoxes.

* `urls`: *required*  
  An object to claim the APIs.

  * `get`: The URL to get all boxes in this page.
  * `add`: The URL to add a box.
  * `thumbup`: The URL to send a thumbup for an existed box.

* `callbacks`: *optional*  
  An object to provide callbacks.

  * `getLoader`: Return HTML code or a jQuery object as the loader shown while loading.
  * `getThumbIcon`: Return HTML code or a jQuery object as the thumb up mark. There is one parameter `hasThumb` to notify whether the current visitor has given a thumb for it.
  * `error`: Callback with one parameter `message` when error occurs.

* `page_id`: *optional*  
  The ID to mark all boxes for current page. If not given, `location.path_name` will be used.

Demo
---

``` javascript
$('body').pboxes({
  get: '/get',
  add: '/add',
  thumbup: '/thumbup',
}, {
  getLoader: function () {
    // Using pure words
    return 'Loading...';
  },
  getThumbIcon: function (hasThumb) {
    // Using pure words
    return hasThumbUp ? '已赞' : '赞';

    // Using font-awesome icons
    return '<i class="fa ' + (hasThumbUp ? 'fa-thumbs-up' : 'fa-thumbs-o-up') + '"></i>';
  },
  error: console.log,
});
```
