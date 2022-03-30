const electronPath = require("electron");
const dotenv = require("dotenv");
const { createServer, build, createLogger } = require("vite");
const { join } = require("path");
const { spawn } = require("child_process");

/** @type 'production' | 'development'' */
const mode = (process.env.MODE = process.env.MODE || "development");

/** @type {import('vite').LogLevel} */
const LOG_LEVEL = "info";

/** @type {import('vite').InlineConfig} */
const sharedConfig = {
  mode,
  build: {
    // Set to {} to enable rollup watcher.
    watch: {},
  },
  logLevel: LOG_LEVEL,
};

/** Messages on stderr that match any of the contained patterns will be stripped from output */
const stderrFilterPatterns = [
  // warning about devtools extension
  // https://github.com/cawa-93/vite-electron-builder/issues/492
  // https://github.com/MarshallOfSound/electron-devtools-installer/issues/143
  /ExtensionLoadWarning/,
];

const startRenderer = () => {
  return new Promise((resolve, reject) => {
    let config = {
      ...sharedConfig,
      configFile: join(__dirname, "../src/renderer/vite.config.js"),
    };
    createServer(config)
      .then(server => {
        server.listen();
        resolve(server);
      })
      .catch(err => reject(err));
  });
};

/**
 * Start or restart App when source files are changed
 * @param {{ws: import('vite').WebSocketServer}} WebSocketServer
 */
const setPreloadWatcher = ({ ws }) => {
  return build({
    ...sharedConfig,
    configFile: "src/preload/vite.config.js",
    plugins: [
      {
        name: "reload-page-on-preload-package-change",
        writeBundle: () => {
          ws.send({
            type: "full-reload",
          });
        },
      },
    ],
  });
};

/**
 * Start or restart App when source files are changed
 * @param {{config: {server: import('vite').ResolvedServerOptions}}} ResolvedServerOptions
 */
const setMainWatcher = ({ config: { server } }) => {
  // Create VITE_DEV_SERVER_URL environment variable to pass it to the main process.
  {
    const protocol = server.https ? "https:" : "http:";
    const host = server.host || "localhost";
    const port = server.port; // Vite searches for and occupies the first free port: 3000, 3001, 3002 and so on
    const path = "/";
    process.env.VITE_DEV_SERVER_URL = `${protocol}//${host}:${port}${path}`;
  }

  const logger = createLogger(LOG_LEVEL, {
    prefix: "[main]",
  });

  /** @type {ChildProcessWithoutNullStreams | null} */
  let spawnProcess = null;

  return build({
    ...sharedConfig,
    configFile: "src/main/vite.config.js",
    plugins: [
      {
        name: "reload-app-on-main-package-change",
        writeBundle() {
          if (spawnProcess !== null) {
            spawnProcess.off("exit", process.exit);
            spawnProcess.kill("SIGINT");
            spawnProcess = null;
          }

          spawnProcess = spawn(String(electronPath), ["."]);
          spawnProcess.stdout.on("data", d => d.toString().trim() && logger.warn(d.toString(), { timestamp: true }));
          spawnProcess.stderr.on("data", d => {
            const data = d.toString().trim();
            if (!data) return;
            const mayIgnore = stderrFilterPatterns.some(r => r.test(data));
            if (mayIgnore) return;
            logger.error(data, { timestamp: true });
          });

          // Stops the watch script when the application has been quit
          spawnProcess.on("exit", process.exit);
        },
      },
    ],
  });
};

(async () => {
  try {
    const viteDevServer = await startRenderer();
    await setPreloadWatcher(viteDevServer);
    await setMainWatcher(viteDevServer);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
