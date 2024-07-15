const { contextBridge, ipcRenderer } = require("electron")

contextBridge.exposeInMainWorld("ClientCommands", {
  sendBoot: async () => { return ipcRenderer.invoke("client.boot"); },
  sendReady: async () => { return ipcRenderer.invoke("client.ready"); },
  send: async (command, parameters=[]) => { return ipcRenderer.invoke(command, parameters); },
  loadTemplate: async (path) => { return ipcRenderer.invoke("client.loadTemplate", path); },
});

contextBridge.exposeInMainWorld("ServerEvents", {
  onBoot: (callback) => { ipcRenderer.on("server.boot", callback) },
  onReady: (callback) => { ipcRenderer.on("server.ready", callback) },
  onRender: (callback) => { ipcRenderer.on("render", callback) },
  onTrigger: (callback) => { ipcRenderer.on("trigger", callback) },
  onLog: (callback) => { ipcRenderer.on("log", callback) },
});
