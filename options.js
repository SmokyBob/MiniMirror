//Use Polymer Bindings
var mainContent = document.querySelector('#optionContent');
var mainWindow = null;
var miniMirror = null;

mainContent.addEventListener('dom-change', function() {
  //get the reference to the Main window so that we can set values on it
  var windowArray = chrome.app.window.getAll();
  for (var i = 0; i < windowArray.length; i++) {
    if (windowArray[i].id != 'options') {
      mainWindow = windowArray[i].contentWindow;
      miniMirror = mainWindow.mainContent;
      break;
    }
  }

  //Get the current color and tolerance
  mainContent.$.colorDisplay.style.backgroundColor =
          mainContent.$.colorPicker.rgbToHex(miniMirror.selectedColor);
  mainContent.tolerancePercentage = miniMirror.tolerancePercentage;

});

mainContent.immediatePercChanged = function(e) {
  if (miniMirror) {
    //Update the tolerance applied on the image
    miniMirror.tolerancePercentage = mainContent.$.tolerance.immediateValue;
  }
};

mainContent.tolerancePercentageChanged = function(e) {
  if (miniMirror) {
    //Update the tolerance applied on the image
    miniMirror.tolerancePercentage = mainContent.$.tolerance.value;
  }
};

mainContent.colorSelected = function(event) {
  var selColor = event.detail;
  //Update the Chroma Key
  miniMirror.selectedColor = selColor.rgb;
  mainContent.$.colorDisplay.style.backgroundColor =
          mainContent.$.colorPicker.rgbToHex(miniMirror.selectedColor);
};
