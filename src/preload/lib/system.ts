import { platform, release, arch} from "os"
import { exposeInMainWorld } from './exposeInMainWorld';

export const system = { platform, release, arch }

exposeInMainWorld('system', system);
