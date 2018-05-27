const { app, BrowserWindow, protocol, Menu } = require('electron')
const path = require('path')
const url = require('url')

let win

function createWindow () {
  const WEB_FOLDER = 'dist'
  const PROTOCOL = 'file'

  win = new BrowserWindow({width: 800, height: 600})

  win.loadURL(url.format({
    pathname: 'index.html',
    protocol: PROTOCOL + ':',
    slashes: true
  }))

  win.on('closed', () => {
    win = null
  })

  Menu.setApplicationMenu(Menu.buildFromTemplate([{
    label: "Application",
    submenu: [
        { label: "Quit", accelerator: "Command+Q", click: function() { app.quit(); }}
    ]}, {
    label: "Edit",
    submenu: [
        { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
        { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
        { type: "separator" },
        { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
        { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
        { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
        { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
    ]}
  ]))

  protocol.interceptFileProtocol('file', (request, callback) => {
    let url = request.url.substr(PROTOCOL.length + 1)
    url = path.join(__dirname, WEB_FOLDER, url)
    url = path.normalize(url)
    console.log(url)
    callback({ path: url })
  }, (err) => {
    if (err) console.error('Failed to register protocol')
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})
