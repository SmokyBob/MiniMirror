/**
 * Listens for the app launching then creates the window
 *
 * @see http://developer.chrome.com/trunk/apps/app.runtime.html
 * @see http://developer.chrome.com/trunk/apps/app.window.html
 */
chrome.app.runtime.onLaunched.addListener(function() {
  // bottom right window on screen.
  var screenWidth = screen.availWidth;
  var screenHeight = screen.availHeight;
  var width = 240;
  var height = 160+50;
  //var width = 640;
  //var height = 480;


  chrome.app.window.create('index.html', {
    bounds: {
      width: width,
      height: height
     /*,
      left:(screenWidth-width),
      top:(screenHeight-height)*/
    },
    resizable:true,
    frame:"chrome",
    type:"panel"
  });
});
