!function(){function t(t){t=~~t;var o=t%170;t=~~(t/170);var n=t%170;t=~~(t/170);var a=t%170;return a>85&&(a+=85),n>85&&(n+=85),o>85&&(o+=85),{r:a,g:n,b:o}}function o(){var t=170*Math.random(),o=170*Math.random(),n=Math.random()*(t>85&&o>85?85:170);return 170*t*170+170*o+n}function n(t,o,n){var a=this;a.$obj=t,a.urls=o,a.callbacks=n||{},a.bindEvents(),a.load()}n.prototype.callback=function(t,o){var n=this.callbacks[t];return n?n.apply(this,o):void 0},n.prototype.bindEvents=function(){var t=this;t.$obj.dblclick(function(n){function a(t){p.html($('<div class="pbox-content">').text(t)),setTimeout(function(){p.addClass("pbox-fading"),setTimeout(e,1e3)},1e3)}function e(){d.remove()}function c(){var o=u.val();if(o){if(o.length<4)return void a("字数这么少，一定是来捣乱的。。");p.html($('<div class="pbox-content">').text(o));{var n=t.callback("getLoader")||"...";$('<div class="pbox-thumbs">').html(n).prependTo(p)}$.post(t.urls.add,{url:location.pathname,x:r,y:l,color:i,text:o},function(n){n.code?a(n.data):t.loadBox({id:n.data,text:o,thumbs:0},d)},"json").fail(function(){a("出错了……看来施主跟本站没有缘分。。")})}else e()}n.preventDefault();var i=o(),s=t.$obj.offset(),r=(n.pageX-s.left)/t.$obj.innerWidth()*100,l=n.pageY-s.top,d=t.loadBox({x:r,y:l,color:i}),p=d.find(".pbox-text").addClass("pbox-input"),u=$('<textarea placeholder="4个字以上才行喔~">').appendTo(p).focus().keydown(function(t){switch(t.keyCode){case 27:e();break;case 13:c()}}).blur(c)}),"static"==t.$obj.css("position")&&t.$obj.css("position","relative")},n.prototype.load=function(){var t=this;$.post(t.urls.get,{url:location.pathname},function(o){o.code||$.each(o.data,function(o,n){t.loadBox(n)})},"json")},n.prototype.getThumbIcon=function(t){return this.callback("getThumbIcon",[t])||(t?"已赞":"赞")},n.prototype.loadBox=function(o,n){if(!n){n=$('<div class="pbox-wrap">').css({left:o.x+"%",top:o.y}).appendTo(this.$obj);var a=t(o.color),e="rgb("+a.r+","+a.g+","+a.b+")",c=.299*a.r+.587*a.g+.114*a.b,i=c>127?"black":"white";$('<div class="pbox-dot">').css({"background-color":e}).appendTo(n),$('<div class="pbox-text">').css({"background-color":e,color:i}).appendTo(n)}if(o.text){var s=this,r=n.find(".pbox-text");r.html($('<div class="pbox-content">').text(o.text));var l=$('<div class="pbox-thumbs">').prependTo(r),d=$('<span class="pbox-icon">').html(s.getThumbIcon(!1)).appendTo(l).one("click",function(t){var a=n.data("id");a&&(d.html(s.getThumbIcon(!0)),$.post(s.urls.thumbup,{id:a},function(t){t.code?(d.html(s.getThumbIcon(!1)),s.callback("error",[t.data])):p.text(++o.thumbs||"")},"json"))}),p=$("<span>").prependTo(l).text(o.thumbs||"");n.data("id",o.id)}},$.fn.pboxes=function(t,o){return new n(this,t,o),this}}();