interface Exposed {
  readonly nodeCrypto: Readonly<typeof import('./lib/nodeCrypto').nodeCrypto>;
  readonly versions: Readonly<typeof import('./lib/versions').versions>;
  readonly ipcOperate: Readonly<typeof import('./lib/ipcOperate').ipcOperate>;
  readonly system: Readonly<typeof import('./lib/system').system>;
}


interface Window extends Exposed { }
