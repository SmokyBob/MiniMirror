//Use Polymer Bindings
var mainContent = document.querySelector('#mainContent');

mainContent.addEventListener('dom-change', function(){
  // Grab elements, create settings, etc.
  //var canvas = document.querySelector("#canvas");
  //var context = canvas.getContext("2d");
  var video = document.querySelector("#video");
  var videoObj = { "video": true };
  var errBack = function(error) {
      console.log("Video capture error: ", error.code);
    };

  // Put video listeners into place
  if(navigator.webkitGetUserMedia) { // WebKit-prefixed
    navigator.webkitGetUserMedia(videoObj, function(stream){
      video.src = window.URL.createObjectURL(stream);
      video.play();
    }, errBack);
  }

});

var resizeWindow = function(){
  var appWindow = chrome.app.window.current();
  var visibileContent = document.querySelector('#video');

  chrome.storage.local.get("windowFrame",function(items){
    var headerHeight = 0;
    var windowFrame='none';

    if (items.windowFrame!='none'){
      headerHeight=33;
    }
    appWindow.resizeTo(visibileContent.offsetWidth,visibileContent.offsetHeight+headerHeight);
  });

};

mainContent.toggleToolbar = function(){
  var collapsable = document.querySelector('#collapsableToolbar');
  //Display/Hide the toolbar
  collapsable.toggle();
};

mainContent.collapseResize = function(){
  resizeWindow();
};

mainContent.closeWindow = function(){
  var windowFrame='none';
  chrome.storage.local.get("windowFrame",function(items){
    if (items != null){
      windowFrame=items.windowFrame;

    }
    var options={};
    options.windowFrame= windowFrame;
    var appWindow = chrome.app.window.current();
    options.top=appWindow.innerBounds.top;
    options.left=appWindow.innerBounds.left;
    options.width=appWindow.innerBounds.width;
    options.height=appWindow.innerBounds.height;

    //Store the variables in the local storage
    chrome.storage.local.set(options, function() {
          // Notify that we saved.
          //message('Settings saved');
          window.close();
        });
  });

};

mainContent.changeWindowMode = function(){

  var windowFrame='chrome';
  chrome.storage.local.get("windowFrame",function(items){
    if (items != null){
      windowFrame=items.windowFrame;
      if (windowFrame=='none'){
        windowFrame='chrome';
      }else{
        windowFrame='none';
      }
    }
    var options={};
    options.windowFrame= windowFrame;
    var appWindow = chrome.app.window.current();
    options.top=appWindow.innerBounds.top;
    options.left=appWindow.innerBounds.left;
    options.width=appWindow.innerBounds.width;
    options.height=appWindow.innerBounds.height;

    //Store the variables in the local storage
    chrome.storage.local.set(options, function() {
          // Notify that we saved.
          //message('Settings saved');
          chrome.runtime.reload(); //Reload the app
        });
  });

};