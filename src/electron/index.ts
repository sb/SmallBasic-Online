import { app, BrowserWindow } from "electron";

let mainWindow: Electron.BrowserWindow | null = null;

function createWindow(): void {
    mainWindow = new BrowserWindow({
        height: 600,
        width: 800
    });

    mainWindow.setMenu(null);
    mainWindow.loadURL(`file://${__dirname}/index.html`);

    mainWindow.on("closed", () => {
        mainWindow = null;
    });
}

app.on("ready", createWindow);

app.on("activate", () => {
    if (mainWindow === null) {
        createWindow();
    }
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
