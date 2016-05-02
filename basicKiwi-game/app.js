var app = require('app')
var BrowserWindow = require('browser-window')
//console.log(app.on)
var f = function (){console.log('hi')}

app.on('ready', function(){
  var mainWindow = new BrowserWindow({
    width: 2000,
    height: 2000
  })
  mainWindow.loadURL('file://'+ __dirname + '/main.html')
  mainWindow.openDevTools()
})
console.log('app.js done')
