import { app, BrowserWindow } from "electron";
import * as algo from "./server/app.js";

function createWindow()
{
    const win = new BrowserWindow({
        width: 1920,
        height: 1080,
        webPreferences: {
            devTools: true,
            contextIsolation: true,
            nodeIntegration: false
        }
    });
    win.loadURL("http://localhost:4040");
    win.maximize();
}

app.whenReady().then(() => {
    createWindow();
});

app.on('window-all-closed',() => {
    if (process.platform !== 'darwin')
    app.quit();
} )