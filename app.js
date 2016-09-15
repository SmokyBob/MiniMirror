const {ipcRenderer} = require('electron');

//Use Polymer Bindings
var mainContent = document.querySelector('#mainContent');

mainContent.videoSources = [];

mainContent.addEventListener('dom-change', function() {
  // chrome.storage.local.get(['selectedColor', 'tolerancePercentage', 'mirrored'],
  //   function(items) {
  //     if (items.selectedColor) {
  //       mainContent.selectedColor = items.selectedColor;
  //       mainContent.tolerancePercentage = items.tolerancePercentage;
  //     } else {
         mainContent.selectedColor = {};
         //Really Green Value
         mainContent.selectedColor.r = 56;
         mainContent.selectedColor.g = 166;
         mainContent.selectedColor.b = 0;
         //Default tolerance 20%
         mainContent.tolerancePercentage = 20;
  //     }
       //Mirrored video by default
       mainContent.mirrored = true;
  //     mainContent.mirrored = ((items.mirrored !== null) ? items.mirrored : true);
  //   });

  navigator.mediaDevices.enumerateDevices()
  .then(function(devices) {
    devices.forEach(function(device) {
        var option = document.createElement('option');
        option.value = device.id;
        if (device.kind === 'video') {
          mainContent.videoSources.push(option);
        }
    });
    //Set the first source
    mainContent.swapSource();
    
  })
  .catch(function(err) {
    console.log(err.name + ": " + err.message);
  });
});

function ChromaKey() {
  // TODO: see if feColorFilter has better performance
  // infos: http://alistapart.com/article/finessing-fecolormatrix
  //        See elim-blue
  //        RGBA to Color Matrix : http://blog.andresgalante.com/random/2016/07/09/rgba-to-fecolormatrix.html

  window.requestAnimationFrame(ChromaKey);
  if (firstResize){
    resizeWindow();
  }


  //Skip any ChromaKey effect if 0 tolerance
  if (mainContent.tolerancePercentage !== 0){
    var v = document.querySelector('#video');
    if (v.paused || v.ended) { return; }

    var w = v.offsetWidth;
    var h = v.offsetHeight;

    //set the canvas Dimensions
    var canvas = document.getElementById('videoscreen');
    canvas.setAttribute('width', w);
    canvas.setAttribute('height', h);
    var con = canvas.getContext('2d');

    con.fillRect(0, 0, w, h);//
    con.drawImage(v, 0, 0, w, h);
  
    var imageData = con.getImageData(0, 0, w, h);
    var data = imageData.data;
  
    for (var i = 0; i < data.length; i += 4) {
      var r = data[i + 0];
      var g = data[i + 1];
      var b = data[i + 2];
  
      //get the tolerance value from the selected percentage
      var percVal = (255 * (mainContent.tolerancePercentage / 100));
  
      // compare rgb levels for green and set alphachannel to 0;
      var selectedColor = mainContent.selectedColor;
      if ((r >= (selectedColor.r - percVal) &&
           r <= (selectedColor.r + percVal)) &&
          (b >= (selectedColor.b - percVal) &&
           b <= (selectedColor.b + percVal)) &&
          (g >= (selectedColor.g - percVal) &&
           g <= (selectedColor.g + percVal))) {
        data[i + 3] = 0;//Set alpha to 0 to make the pixel transparent
      }
    }
    con.putImageData(imageData, 0, 0);
  }
}
var firstResize = true;

var resizeWindow = function() {
  var visibileContent = document.querySelector('#videoscreen');

  if (visibileContent) {
    
    // chrome.storage.local.get('windowFrame', function(items) {
    let headerHeight = 0;
    // if (items.windowFrame != 'none') {
      // headerHeight = 33;
    // }
    //Send the change Open Option command
    ipcRenderer.send('async-ops', {
        command: 'adaptSize',
        height: visibileContent.offsetHeight + headerHeight + 5
      });
    
    firstResize = false;
  }
};

var collapseTimeout = null;

mainContent.toggleToolbar = function() {
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
  
  var videoObj = {video: {}};
  
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

mainContent.collapseResize = function() {
  setTimeout(function() {
    resizeWindow();
  }, 100);
  
};

mainContent.closeWindow = function() {
  var windowFrame = 'none';
  // chrome.storage.local.get('windowFrame', function(items) {
  //   if (items) {
  //     windowFrame = items.windowFrame;
  //   }

  //   var options = {};
  //   options.windowFrame = windowFrame;
  //   var appWindow = chrome.app.window.current();
  //   options.top = appWindow.innerBounds.top;
  //   options.left = appWindow.innerBounds.left;
  //   options.width = appWindow.innerBounds.width;
  //   options.height = appWindow.innerBounds.height;
  //   options.tolerancePercentage = mainContent.tolerancePercentage;
  //   options.selectedColor = mainContent.selectedColor;
  //   options.mirrored = mainContent.mirrored;

  //   //Store the variables in the local storage
  //   chrome.storage.local.set(options, function() {
  //     // Notify that we saved.
  //     //Close all the app windows
  //     var windowArray = chrome.app.window.getAll();
  //     for (var i = 0; i < windowArray.length; i++) {
  //       var win = windowArray[i];
  //       win.contentWindow.close();
  //     }
  //   });
  // });

  //TODO: Save the infos in the main thread
  
  //Send the fullClose command 
  ipcRenderer.send('async-ops', {command: 'fullClose'}); 

};

mainContent.changeWindowMode = function() {

  //Send the change Frame Mode
  ipcRenderer.send('async-ops', {command: 'changeFrame'});

};

mainContent.openOption = function() {
  
  //Send the change Open Option command
  ipcRenderer.send('async-ops', {command: 'openOptions'});
  
};
