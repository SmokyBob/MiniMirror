//Use Polymer Bindings
var mainContent = document.querySelector('#optionContent');
var mainWindow = null;

mainContent.addEventListener('template-bound', function(){
  //get the reference to the Main window so that we can set values on it
  var windowArray = chrome.app.window.getAll();
  for(var i=0;i<windowArray.length;i++){
    if(windowArray[i].id!='options'){
      mainWindow = windowArray[i].contentWindow;
      break;
    };
  }

});

mainContent.colorSelected = function(event){
  var selColor=event.detail;
  mainWindow.selectedColor = selColor.rgb;
};