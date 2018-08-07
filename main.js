const electron = require('electron')
const path = require('path')
const url = require('url')
const debug = require('electron-debug')

const {app, BrowserWindow, Menu} = electron

debug({
    enabled: false
})

try {
    require('electron-reloader')(module);
} catch (err) {}

let mainWindow
let openFilesWindow

// Listen for app to be ready
app.on('ready', () => {
    // Create new window
    mainWindow = new BrowserWindow({
        width: 800,
        height: 500
    })
    // Load html into window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'main.html'),
        protocol: 'file:',
        slashes: true
    }))

    // Build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate)
    // Insert menu
    Menu.setApplicationMenu(mainMenu)
})



// Create menu template
const mainMenuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Open',
                click () {
                    // Open files window
                    openFilesWindow = new BrowserWindow({
                        width: 250,
                        height: 100
                    })
                    openFilesWindow.setMenuBarVisibility(false)
                    openFilesWindow.loadURL(url.format({
                        pathname: path.join(__dirname, 'open_files_window.html'),
                        protocol: 'file:',
                        slashes: true
                    }))
                }
            }
        ],
    },
    {
        label: 'Edit',
        submenu: [
            {role: 'undo'},
            {role: 'redo'},
            {type: 'separator'},
            {role: 'cut'},
            {role: 'copy'},
            {role: 'paste'},
            {role: 'pasteandmatchstyle'},
            {role: 'delete'},
            {role: 'selectall'}
        ]
    },
    {
        label: 'View',
        submenu: [
            {role: 'reload'},
            {role: 'forcereload'},
            {role: 'toggledevtools'},
            {type: 'separator'},
            {role: 'resetzoom'},
            {role: 'zoomin'},
            {role: 'zoomout'},
            {type: 'separator'},
            {role: 'togglefullscreen'}
        ]
    },
    {
        role: 'window',
        submenu: [
            {role: 'minimize'},
            {role: 'close'}
        ]
    },
    {
        role: 'help',
        submenu: [
            {
                label: 'Learn More',
                click () { require('electron').shell.openExternal('https://electronjs.org') }
            }
        ]
    }
]

// Handle context menu
require('electron-context-menu')({
    prepend: (params, browserWindow) => [{
        label: 'Rainbow',
        // Only show it when right-clicking images
        visible: params.mediaType === 'image'
    }]
});

