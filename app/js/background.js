chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('../index.html', {
    'outerBounds': {
      width: 1920,
      height: 1080,
      left: 0,
      top: 0
    }
  });
});