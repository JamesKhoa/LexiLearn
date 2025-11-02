const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('lexilearn', {
  saveSetting: (key, value) => ipcRenderer.invoke('settings:save', { key, value }),
  loadSettings: () => ipcRenderer.invoke('settings:load')
});
