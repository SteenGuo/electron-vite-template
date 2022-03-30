import { ipcRenderer, shell } from "electron"
import { exposeInMainWorld } from './exposeInMainWorld';

export const ipcOperate = {
  ipcRenderer, 
  shell,
  crash() {
    process.crash();
  },

  openNewWin(url: string) {
    ipcRenderer.invoke("open-win", { url });
  },

  changeTheme() {
    ipcRenderer.invoke("theme-custom");
  },

  resetTheme() {
    ipcRenderer.invoke("theme-system");
  }
}

exposeInMainWorld('ipcOperate', ipcOperate);