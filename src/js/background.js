chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('index.html', {
	'frame': 'none', 
    'bounds': {
      'width': screen.width / 2,
      'height': screen.height /2
    }
  });
});