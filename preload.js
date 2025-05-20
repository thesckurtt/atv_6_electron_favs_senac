const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('authAPI', {
  login: (credentials) => ipcRenderer.invoke('login', credentials),
  register: (credentials) => ipcRenderer.invoke('register', credentials),
  logout: () => ipcRenderer.send('logout')
})