import { Eta as EtaCore } from "./core.ts";
import { readFile, resolvePath } from "./file-handling.ts";
export {
  EtaParseError,
  EtaRuntimeErr,
  EtaFileResolutionError,
  EtaNameResolutionError,
} from "./err.ts";

export class Eta extends EtaCore {
  readFile = readFile;

  resolvePath = resolvePath;
}
