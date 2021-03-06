/**
 * Listens for the app launching then creates the window
 *
 * @see http://developer.chrome.com/trunk/apps/app.runtime.html
 * @see http://developer.chrome.com/trunk/apps/app.window.html
 */
chrome.app.runtime.onLaunched.addListener(function() {

  //Defaults
  var width = 640;
  var height = 480;
  var left = Math.round((screen.availWidth-width)/2);
  var top = Math.round((screen.availHeight-height)/2);
  var windowFrame = "none";

  //Get the variables from the local storage
  chrome.storage.local.get(["windowFrame","top","left","width","height"],
    function(items){
      if (items){
        windowFrame = ((items.windowFrame) ? items.windowFrame : 'none');
        width = ((items.width) ? items.width : 640);
        height = ((items.height) ? items.height : 480);
        left = ((items.left) ? items.left : Math.round((screen.availWidth - width) / 2));
        top = ((items.top) ? items.top : Math.round((screen.availHeight - height) / 2));
      }

      //Create the new window with the default values or the one from the local storage
      chrome.app.window.create('app.html', {
        //id:'miniMirror',
        bounds: {
          width: width,
          height: height,
          top:top,
          left:left
        },
        resizable:true,
        frame:windowFrame,
        alwaysOnTop:true
      });
    });

});

