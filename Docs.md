Document
===
This is the document for creating a new backend.

All APIs returns an object with attributes below:

* `code`: *integer*  
  `code` is zero if succeeded, otherwise non-zero.

* `data`: *any*  
  If an error occurred, `data` will be the error message. Otherwise see below.

APIs
---
* urls.`get`  
  The URL to get data of all boxes.
  * Method: POST
  * Parameters:
    * `url`: URL of current page, used as a page ID.
  * Return `data`:
    * a list of box data objects.

* urls.`add`  
  The URL to post data of a new box.
  * Method: POST
  * Parameters:
    * `url`: URL of current page, used as a page ID.
    * `x`: X axis value, belongs to \[0, 100\] as a percentage of the parent width.
    * `y`: Y axis value, pixels from the parent top.
    * `color`: an integer transformed from RGB.
    * `text`: text of the comment.
  * Return `data`:
    * ID of the comment just added.

* urls.`thumbup`  
  The URL to give a thumb up to a box
  * Method: POST
  * Parameters:
    * `id`: the ID of current comment.
  * Return `data`:
    * not specified yet

