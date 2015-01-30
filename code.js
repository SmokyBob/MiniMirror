//Use Polymer Bindings
var mainContent = document.querySelector('#mainContent');

mainContent.addEventListener('template-bound', function(){

  chrome.storage.local.get(["selectedColor","tolerancePercentage"],
    function(items){
      if (items.selectedColor != null){
        mainContent.selectedColor=items.selectedColor;
        mainContent.tolerancePercentage=items.tolerancePercentage;
      }else{
        mainContent.selectedColor={};
        //Really Green Value
        mainContent.selectedColor.r=56;
        mainContent.selectedColor.g=166;
        mainContent.selectedColor.b=0;
        //Default tolerance 20%
        mainContent.tolerancePercentage = 20;
      }
    });

  // Grab elements, create settings, etc.
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

      ChromaKey();
    }, errBack);
  }

});

function ChromaKey(){
  window.requestAnimationFrame(ChromaKey);
  var v = document.querySelector("#video");
  if (v.paused || v.ended) return;

  var w = v.offsetWidth;
  var h = v.offsetHeight;

  //set the canvas Dimensions
  var canvas = document.getElementById("videoscreen");
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
    var percVal = (255*(mainContent.tolerancePercentage/100));

    // compare rgb levels for green and set alphachannel to 0;
    var selectedColor = mainContent.selectedColor;
    if ((r >= (selectedColor.r - percVal) && r <= (selectedColor.r + percVal)) &&
        (b >= (selectedColor.b - percVal) && b <= (selectedColor.b + percVal)) &&
        (g >= (selectedColor.g - percVal) && g <= (selectedColor.g + percVal)))
    {
      data[i + 3]=0;//Set aplha to 0 to make the pixel transparent
    }
  }
  con.putImageData(imageData, 0, 0);
}

var resizeWindow = function(){
  var appWindow = chrome.app.window.current();
  var visibileContent = document.querySelector('#videoscreen');

  chrome.storage.local.get("windowFrame",function(items){
    var headerHeight = 0;
    var windowFrame='none';

    if (items.windowFrame!='none'){
      headerHeight=33;
    }
    appWindow.resizeTo(visibileContent.offsetWidth,visibileContent.offsetHeight+headerHeight);
  });

}

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
      //Close all the app windows
      var windowArray = chrome.app.window.getAll();
      for(var i=0;i<windowArray.length;i++){
        var win = windowArray[i];
        win.contentWindow.close();
      }
    });
  });

}

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

mainContent.openOption = function(){
  //Create the new window with the default values or the one from the local storage
  chrome.app.window.create('options.html', {
    id:"options",
    bounds: {
      width: 480,
      height: 360
    },
    resizable:false,
    frame:"chrome",
    alwaysOnTop:true
  });
};
