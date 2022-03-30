import { app } from 'electron';
import MainInit from './windowManager';
import './security-restrictions';

const windows = new MainInit()

/**
 * Disable Hardware Acceleration for more power-save
 */
app.disableHardwareAcceleration();

/**
 * Create app window when background process will be ready
 */
app.whenReady()
  .then(windows.restoreOrCreateWindow)
  .catch((e) => console.error('Failed create window:', e));


/**
* Install Vue.js or some other devtools in development mode only
*/
if (import.meta.env.DEV) {
  app.whenReady()
    .then(() => import('electron-devtools-installer'))
    .then(({ default: installExtension, VUEJS3_DEVTOOLS }) => installExtension(VUEJS3_DEVTOOLS, {
      loadExtensionOptions: {
        allowFileAccess: true,
      },
    }))
    .catch(e => console.error('Failed install extension:', e));
}

/**
 * Prevent multiple instances
 */
const isSingleInstance = app.requestSingleInstanceLock();
if (!isSingleInstance) {
  app.quit();
  process.exit(0);
}
app.on('second-instance', windows.restoreOrCreateWindow);



/**
 * Shout down background process if all windows was closed
 */
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

/**
 * @see https://www.electronjs.org/docs/v14-x-y/api/app#event-activate-macos Event: 'activate'
 */
app.on('activate', windows.restoreOrCreateWindow);


/**
 * Check new app version in production mode only
 */
if (import.meta.env.PROD) {
  app.whenReady()
    .then(() => import('electron-updater'))
    .then(({ autoUpdater }) => autoUpdater.checkForUpdatesAndNotify())
    .catch((e) => console.error('Failed check updates:', e));
}

