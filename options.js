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

  //Get the current color
  mainContent.$.colorDisplay.style.backgroundColor = mainContent.$.color_picker.rgbToHex(miniMirror.selectedColor);
  mainContent.tolerancePercentage = miniMirror.tolerancePercentage;


});

mainContent.tolerancePercentageChanged = function(e){
  if (miniMirror){
    miniMirror.tolerancePercentage = mainContent.tolerancePercentage;
  }
}

mainContent.colorSelected = function(event){
  var selColor=event.detail;
  miniMirror.selectedColor = selColor.rgb;
  mainContent.$.colorDisplay.style.backgroundColor = mainContent.$.color_picker.rgbToHex(miniMirror.selectedColor);
};