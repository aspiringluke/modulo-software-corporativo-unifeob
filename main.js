import { app, BrowserWindow } from "electron";
import * as algo from "./server/app.js";

function createWindow()
{
    const win = new BrowserWindow({
        width: 1920/2,
        height: 1080/2
    });
    win.loadURL("http://localhost:4040");
}

app.whenReady().then(() => {
    createWindow();
});

app.on('window-all-closed',() => {
    if (process.platform !== 'darwin')
    app.quit();
} )