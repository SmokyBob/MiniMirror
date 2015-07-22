//Use Polymer Bindings
var mainContent = document.querySelector('#mainContent');

mainContent.videoSources = [];

mainContent.addEventListener('dom-change', function(){
  chrome.storage.local.get(['mirrored'],
    function(items) {
      //Mirrored video by default
      mainContent.mirrored = ((items.mirrored !== null) ? items.mirrored : true);
    });
    
    MediaStreamTrack.getSources(
    function (sourceInfos) {
      for (var i = 0; i !== sourceInfos.length; ++i) {
        var sourceInfo = sourceInfos[i];
        var option = document.createElement('option');
        option.value = sourceInfo.id;
        if (sourceInfo.kind === 'video') {
          mainContent.videoSources.push(option);
        }  
      }
      //Set the first source
      mainContent.swapSource();
    });

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

var collapseTimeout = null;

mainContent.toggleToolbar = function(){
  var collapsable = document.querySelector('#collapsableToolbar');
  //Display/Hide the toolbar
  collapsable.toggle();
  if (collapseTimeout) {
    clearTimeout(collapseTimeout);
  }
  if (collapsable.opened){
    //AutoCollapse the toolbar after 5 second
    collapseTimeout = setTimeout(function() {
      collapsable.opened = false;
    }, 5000);
  }
};

mainContent._mirroredClass = function(isMirrored) {
  return ((isMirrored) ? 'mirrored' : '');
};

mainContent.swapHoriz = function(){
  mainContent.mirrored = !mainContent.mirrored;
};

mainContent.sourceIdx = -1;

mainContent.swapSource = function(){
  mainContent.sourceIdx = mainContent.sourceIdx + 1;
  
  if(mainContent.videoSources.length == mainContent.sourceIdx){
    mainContent.sourceIdx = 0;
  }
  
  // Grab elements, create settings, etc.
  var video = document.querySelector('#video');
  var errBack = function(error) {
    console.log('Video capture error: ', error.code);
  };
  
  var videoObj = {video: true};
  
  if (mainContent.videoSources.length > 0) {
    videoObj = {
      video: {
        optional: [{
          sourceId: mainContent.videoSources[mainContent.sourceIdx].value
        }]
      }
    };
  }
  // Put video listeners into place
  if (navigator.webkitGetUserMedia) { // WebKit-prefixed
    navigator.webkitGetUserMedia(videoObj, function(stream) {
      video.src = window.URL.createObjectURL(stream);
      video.play();

      ChromaKey();
    }, errBack);
  }
};

mainContent.collapseResize = function(){
  resizeWindow();
};

mainContent.closeWindow = function(){
  var windowFrame='none';
  chrome.storage.local.get("windowFrame",function(items){
    if (items){
      windowFrame=items.windowFrame;
    }
    var options={};
    options.windowFrame= windowFrame;
    var appWindow = chrome.app.window.current();
    options.top=appWindow.innerBounds.top;
    options.left=appWindow.innerBounds.left;
    options.width=appWindow.innerBounds.width;
    options.height=appWindow.innerBounds.height;
    options.mirrored = mainContent.mirrored;

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
    if (items){
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
    options.mirrored = mainContent.mirrored;

    //Store the variables in the local storage
    chrome.storage.local.set(options, function() {
          // Notify that we saved.
          //message('Settings saved');
          chrome.runtime.reload(); //Reload the app
        });
  });

};