/*
 * extension.js - contains your code to be run on page load
 *
 */

(function(u) {
  // Any code that follows will run on document ready...
  
  function init() {
    var youtubeLinks,
        onYoutube = false;
    
    if (window.location.href.indexOf('youtube') >= 0){
      youtubeLinks = document.querySelectorAll('a[href*="/"]');
      onYoutube = true;
    }
    else{
      youtubeLinks = document.querySelectorAll('a[href*="youtube.com/watch"], a[href*="youtu.be"]');
    }
    
    var len = youtubeLinks.length;
    for (var i=0; i<len; i++) {
      if (youtubeLinks[i]) {
        var url = youtubeLinks[i].href.replace('http://', ''),
            matches = url.match(/v=([\w\-]+)/);
        
        // Don't match youtu.be links if we're on youtube.com
        if (!matches && !onYoutube) {
          matches = url.match(/\/([\w\-]+)/);
        }
        if (matches) {
          // rewrite the link...
          youtubeLinks[i].href = location.protocol + '//www.youtube.com/v/'+matches[1];

          // listen for clicks on youtube links and open them in a new tab rather 
          // than following them the normal way...
          youtubeLinks[i].addEventListener('click', function(e) {
            e.preventDefault();
            BabelExt.tabs.create(e.target.href);
          });
        }
      }
    }
  }
  

  // For compatibility with Reddit Enhancement Suite and other addons that might add
  // infinite scroll, listen for new links to be added to the page as well.
  window.onload = function() {
    document.addEventListener('DOMNodeInserted', init, false);
    init();
  };


})();
