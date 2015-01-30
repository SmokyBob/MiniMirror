//Use Polymer Bindings
var mainContent = document.querySelector('#optionContent');
var mainWindow = null;
var miniMirror = null;

mainContent.addEventListener('template-bound', function(){
  //get the reference to the Main window so that we can set values on it
  var windowArray = chrome.app.window.getAll();
  for(var i=0;i<windowArray.length;i++){
    if(windowArray[i].id!='options'){
      mainWindow = windowArray[i].contentWindow;
      miniMirror = mainWindow.mainContent;
      break;
    };
  }

  //Get the current color and tolerance
  mainContent.$.colorDisplay.style.backgroundColor = mainContent.$.color_picker.rgbToHex(miniMirror.selectedColor);
  mainContent.tolerancePercentage = miniMirror.tolerancePercentage;

});

mainContent.tolerancePercentageChanged = function(e){
  if (miniMirror){
    //Update the tolerance applied on the image
    miniMirror.tolerancePercentage = mainContent.tolerancePercentage;
    //Store the tolerance
    var options = {'tolerancePercentage':miniMirror.tolerancePercentage};
    chrome.storage.local.set(options, function() {
      //debugger;
    });
  }
}

mainContent.colorSelected = function(event){
  var selColor=event.detail;
  //Update the Chroma Key
  miniMirror.selectedColor = selColor.rgb;
  mainContent.$.colorDisplay.style.backgroundColor = mainContent.$.color_picker.rgbToHex(miniMirror.selectedColor);

  //Store the selected color
  var options = {'selectedColor':miniMirror.selectedColor};
  chrome.storage.local.set(options, function() {
      //debugger;
    });
};