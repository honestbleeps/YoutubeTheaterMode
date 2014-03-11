chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		// all requests expect a JSON object with requestType and then the relevant
		// companion information...
		switch(request.requestType) {
			case 'xmlhttpRequest':
				var xhr = new XMLHttpRequest();
				xhr.open(request.method, request.url, true);
				if (request.method == "POST") {
					xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
					// xhr.setRequestHeader("Content-length", request.data.length);
					// xhr.setRequestHeader("Connection", "close");					
				}
				xhr.onreadystatechange = function() {
				  if (xhr.readyState == 4) {
					sendResponse(xhr);
				  }
				}
				xhr.send(request.data);
				break;
			case 'createTab':
				console.log('wat');
				var focus = (request.background != true);
				if (typeof(request.index) != 'undefined') {
					var newIndex = request.index;
				} else {
					// If index wasn't specified, get the selected tab so we can get the index of it.
					// This allows us to open our new tab as the "next" tab in order rather than at the end.
					var newIndex = sender.tab.index+1;
				}
				chrome.tabs.create({url: request.url, selected: focus, index: newIndex});
				sendResponse({status: "success"});
				break;
			case 'createNotification':
	          if (!request.icon) {
	          	// if no icon specified, make a single pixel empty gif so we don't get a broken image link.
	          	request.icon = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
	          }
	          var notification = window.webkitNotifications.createNotification(
	            request.icon,  // icon url - can be relative
	            request.title,  // notification title
	            request.text  // notification body text
	          );
	          notification.show();
	          break;
			case 'localStorage':
				switch (request.operation) {
					case 'getItem':
						sendResponse({status: true, key: request.itemName, value: localStorage.getItem(request.itemName)});
						break;
					case 'removeItem':
						localStorage.removeItem(request.itemName);
						sendResponse({status: true, key: request.itemName, value: null});
						break;
					case 'setItem':
						localStorage.setItem(request.itemName, request.itemValue);
						sendResponse({status: true, key: request.itemName, value: request.itemValue});
						break;
				}
				break;
			case 'addURLToHistory':
				chrome.history.addUrl({url: request.url});
				break;
			default:
				sendResponse({status: "unrecognized request type"});
				break;
		}
	}
);