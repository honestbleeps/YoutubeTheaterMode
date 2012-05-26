// ==UserScript==
// @name          BabelExt Extension
// @namespace     http://babelext.com/
// @description   An extension built with BabelExt
// @copyright     2012, Steve Sobel (http://babalext.com/)
// @author        honestbleeps
// @include       http://*
// @version       0.9
// ==/UserScript==

/*
 * extension.js - contains your code to be run on page load
 *
 */

(function(u) {
  // Any code that follows will run on document ready...

  // this ugly hack is because Opera seems to run userJS on iFrames regardless of @include and @exclude directives.
  // unfortunately, more sites than you'd guess use iframes - which can cause unexpected behavior if Opera goes and
  // runs this script on a page it's not meant to be run
  if (window!=window.top) { 
    return false;
  }

  function init() {
    var youtubeLinks = document.querySelectorAll('a[href*="youtube.com/watch"], a[href*="youtu.be"]');
    var len = youtubeLinks.length;
    for (var i=0; i<len; i++) {
      if (youtubeLinks[i]) {
        var url = youtubeLinks[i].href.replace('http://', '');
        var matches = url.match(/v=([\w\-]+)/);
        if (!matches) {
          matches = url.match(/\/([\w\-]+)/);
        }
        if (matches) {
          // rewrite the link...
          youtubeLinks[i].href = 'http://www.youtube.com/v/'+matches[1];

          youtubeLinks[i].addEventListener('click', function(e) {
            e.preventDefault();
            BabelExt.tabs.create(e.target.href);
          });
        }
      }
    }

  }
  window.onload = function() {
    init();
  };


})();