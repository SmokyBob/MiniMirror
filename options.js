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
  
  mainContent.resolutions = [
    {label: "96p - 4:3", width:"128", height:"96"},
    {label: "120p - 4:3", width:"160", height:"120"},
    {label: "144p - 16:9", width:"256", height:"144"},
    {label: "240p - 4:3", width:"320", height:"240"},
    {label: "288p - 4:3", width:"352", height:"288"},
    {label: "360p - 4:3", width:"480", height:"360"},
    {label: "360p - 16:9", width:"640", height:"360"},
    {label: "480p - 16:9", width:"704", height:"480"},
    {label: "720p - 16:9", width:"1280", height:"720"},
    {label: "1080p - 16:9", width:"1920", height:"1080"}
    ];
    
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
  if (miniMirror){
    var selColor = event.detail;
    //Update the Chroma Key
    miniMirror.selectedColor = selColor.rgb;
    mainContent.$.colorDisplay.style.backgroundColor =
      mainContent.$.colorPicker.rgbToHex(miniMirror.selectedColor);
  
    miniMirror.selectedColor = selColor.rgb;
      
  }
  
};

mainContent.resolutionChanged = function(event) {
  console.log('salam');
};