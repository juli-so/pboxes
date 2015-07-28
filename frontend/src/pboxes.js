/**
 * pBoxes: Boxes on page everywhere
 * @author Gerald <i@gerald.top>
 */

!function () {
	/**
	 * Translate a number to a color object
	 * whose R, G, B belongs to [0, 85] and [170, 255]
	 * @param color {Number}
	 * @return color {Object}
	 */
	function getColorObj(color) {
		color = ~~ color;
		var blue = color % 170; color = ~~ (color / 170);
		var green = color % 170; color = ~~ (color / 170);
		var red = color % 170;
		if (red > 85) red += 85;
		if (green > 85) green += 85;
		if (blue > 85) blue += 85;
		return {
			r: red,
			g: green,
			b: blue,
		};
	}

	/**
	 * Generate a random color
	 * @return color {Number}
	 */
	function randomColor() {
		// Make sure R, G, B do not belongs to [170, 255] at the same time
		// in which case the color might be too bright as a background-color
		var red = Math.random() * 170;
		var green = Math.random() * 170;
		var blue = Math.random() * (red > 85 && green > 85 ? 85 : 170);
		return red * 170 * 170 + green * 170 + blue;
	}

	/**
	 * @class Dots
	 * @constructor
	 * @param urls {Object} The URLs for getting and posting data
	 *     urls.get {String} The URL to get data of all boxes
	 *     urls.add {String} The URL to post data of a new box
	 *     urls.thumbup {String} The URL to give a thumb up to a box
	 * @param callbacks {Object} Provide some callbacks optionally
	 *     callbacks.getLoader {Function}
	 *         Return HTML code or jQuery object to show as a loader
	 *     callbacks.getThumbIcon {Function}
	 *         @param hasThumbUp {Boolean}
	 *         Return HTML code or jQuery object to show as a thumb-up icon
   *     callbacks.error {Function}
   *         @param message {String}
   *         Send an error message
	 */
	function Boxes(frame, urls, callbacks) {
    var _this = this;
		_this.$obj = frame;
		_this.urls = urls;
		_this.callbacks = callbacks || {};
    _this.bindEvents();
    _this.load();
	}

	/**
	 * Make a callback and return the results
	 * @param name {String} The name of the callback
	 * @param args {Any} The arguments to be passed to the callback
	 */
	Boxes.prototype.callback = function (name, args) {
		var callback = this.callbacks[name];
		if (callback) return callback.apply(this, args);
	};

	/**
	 * Bind events to all existed and new boxes
	 */
	Boxes.prototype.bindEvents = function () {
		var _this = this;
		_this.$obj.dblclick(function (e) {
			function fail(msg) {
				text.html($('<div class="pbox-content">').text(msg));
				// Delay 1000ms for showing the message
				setTimeout(function () {
					text.addClass('pbox-fading');
					// Delay 1000ms for fading
					setTimeout(remove, 1000);
				}, 1000);
			}
			function remove() {
				box.remove();
			}
			function submit() {
				var value = textarea.val();
				if (value) {
					if (value.length < 4) {
						fail('字数这么少，一定是来捣乱的。。');
						return;
					}
					text.html($('<div class="pbox-content">').text(value));
					var loader = _this.callback('getLoader') || '...';
					var loading = $('<div class="pbox-thumbs">')
						.html(loader)
						.prependTo(text);
					$.post(_this.urls.add, {
						url: location.pathname,
						x: x,
						y: y,
						color: color,
						text: value,
					}, function (ret) {
						if (ret.code) fail(ret.data);
						else _this.loadBox({
							id: ret.data,
							text: value,
							thumbs: 0,
						}, box);
					}, 'json').fail(function () {
						fail('出错了……看来施主跟本站没有缘分。。');
					});
				} else remove();
			}

			e.preventDefault();
			var color = randomColor();
			var offset = _this.$obj.offset();
			var x = (e.pageX - offset.left) / _this.$obj.innerWidth() * 100;
			var y = e.pageY - offset.top;
			var box = _this.loadBox({
				x: x,
				y: y,
				color: color,
			});
			var text = box.find('.pbox-text').addClass('pbox-input');
			var textarea = $('<textarea placeholder="4个字以上才行喔~">')
				.appendTo(text)
				.focus()
				.keydown(function (e) {
					switch(e.keyCode) {
						case 27:	// escape
							remove();
							break;
						case 13:	// enter
							submit();
							break;
					}
				})
				.blur(submit);
		});
		if (_this.$obj.css('position') == 'static')
			_this.$obj.css('position', 'relative');
	};

	/**
	 * Load all boxes
	 */
	Boxes.prototype.load = function () {
		var _this = this;
		$.post(_this.urls.get, {
			url: location.pathname,
		}, function (ret) {
			if (!ret.code)
				$.each(ret.data, function(i, data) {_this.loadBox(data);});
		}, 'json');
	};

	Boxes.prototype.getThumbIcon = function (hasThumbUp) {
		return this.callback('getThumbIcon', [hasThumbUp])
			|| (hasThumbUp ? '已赞' : '赞');
	};

	/**
	 * Load or refresh a box
	 * @param data {Object} Attributes of the box
	 *     x: left as percentage of the width of parent
	 *     y: top
	 *     color: color number
	 * @param box {Object} The jQuery object of the box or null
	 * @return box {Object} The jQuery object
	 */
	Boxes.prototype.loadBox = function (data, box) {
    if (!box) {
      box = $('<div class="pbox-wrap">')
				.css({
					left: data.x + '%',
					top: data.y,
				}).appendTo(this.$obj);
      var bg = getColorObj(data.color);
      var bgc = 'rgb(' + bg.r + ',' + bg.g + ',' + bg.b + ')';
      var y = .299 * bg.r + .587 * bg.g + .114 * bg.b;
      var fgc = y > 127 ? 'black' : 'white';
      $('<div class="pbox-dot">').css({
        'background-color': bgc,
      }).appendTo(box);
      $('<div class="pbox-text">').css({
        'background-color': bgc,
        color: fgc,
      }).appendTo(box);
    }
		if(data.text) {
      var _this = this;
      var text = box.find('.pbox-text');
			text.html($('<div class="pbox-content">').text(data.text));
			var thumbswrap = $('<div class="pbox-thumbs">').prependTo(text);
			var icon = $('<span class="pbox-icon">').html(_this.getThumbIcon(false))
				.appendTo(thumbswrap)
				.one('click', function (e) {
					var id = box.data('id');
					if (id) {
						icon.html(_this.getThumbIcon(true));
						$.post(_this.urls.thumbup, {
							id: id,
						}, function (ret) {
							if (ret.code) {
								icon.html(_this.getThumbIcon(false));
                _this.callback('error', [ret.data]);
              } else
								thumbup.text((++ data.thumbs) || '');
            }, 'json');
          }
				});
			var thumbup = $('<span>').prependTo(thumbswrap)
				.text(data.thumbs || '');
      box.data('id', data.id);
		}
	}

	// Add as a jQuery plugin
	$.fn.pboxes = function (urls, callbacks) {
		new Boxes(this, urls, callbacks);
		return this;
	};
}();
