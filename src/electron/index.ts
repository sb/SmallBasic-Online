import { app, BrowserWindow } from "electron";

app.on("ready", () => {
    const mainWindow = new BrowserWindow({
        height: 600,
        width: 800
    });

    mainWindow.setMenu(null);
    mainWindow.loadURL(`file://${__dirname}/index.html`);
});

app.on("window-all-closed", function () {
    app.quit();
});
