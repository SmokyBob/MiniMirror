/**
 * Listens for the app launching then creates the window
 *
 * @see http://developer.chrome.com/trunk/apps/app.runtime.html
 * @see http://developer.chrome.com/trunk/apps/app.window.html
 */
chrome.app.runtime.onLaunched.addListener(function() {

  //Defaults
  var width = 240;
  var height = 160;
  var left = Math.round((screen.availWidth-width)/2);
  var top = Math.round((screen.availHeight-height)/2);
  var windowFrame = "none";

  //Get the variables from the local storage
  chrome.storage.local.get(["windowFrame","top","left","width","height"],
    function(items){
      if (items != null){
        windowFrame=items.windowFrame;
        width=items.width;
        height=items.height;
        left=items.left;
        top=items.top;
      }

      //Create the new window with the default values or the one from the local storage
      chrome.app.window.create('index.html', {
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

