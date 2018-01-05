import { ipcRenderer as ipc } from 'electron'
import fs from 'fs'


export const openUrl = (url: String) => ipc.send('openExternal', url)

export const appQuit = () => ipc.send('appQuit')

export const toggleFullScreen = (setTo) => ipc.send('toggleFullScreen', setTo)

export const setTitle = (title: String) => ipc.send('setTitle', title)