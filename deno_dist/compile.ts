import compileToString from "./compile-string.ts";
import { getConfig } from "./config.ts";
import EtaErr from "./err.ts";

/* TYPES */

import { EtaConfig, PartialConfig } from "./config.ts";
import { CallbackFn } from "./file-handlers.ts";
import { getAsyncFunctionConstructor } from "./polyfills.ts";
export type TemplateFunction = (
  data: object,
  config: EtaConfig,
  cb?: CallbackFn,
) => string;

/* END TYPES */

/**
 * Takes a template string and returns a template function that can be called with (data, config, [cb])
 *
 * @param str - The template string
 * @param config - A custom configuration object (optional)
 *
 * **Example**
 * 
 * ```js
 * let compiledFn = eta.compile("Hi <%= it.user %>")
 * // function anonymous()
 * let compiledFnStr = compiledFn.toString()
 * // "function anonymous(it,E,cb\n) {\nvar tR='';tR+='Hi ';tR+=E.e(it.user);if(cb){cb(null,tR)} return tR\n}"
 * ```
 */

export default function compile(
  str: string,
  config?: PartialConfig,
): TemplateFunction {
  var options: EtaConfig = getConfig(config || {});
  var ctor; // constructor

  /* ASYNC HANDLING */
  // The below code is modified from mde/ejs. All credit should go to them.
  if (options.async) {
    ctor = getAsyncFunctionConstructor() as FunctionConstructor;
  } else {
    ctor = Function;
  }
  /* END ASYNC HANDLING */
  try {
    return new ctor(
      options.varName,
      "E", // EtaConfig
      "cb", // optional callback
      compileToString(str, options),
    ) as TemplateFunction; // eslint-disable-line no-new-func
  } catch (e) {
    if (e instanceof SyntaxError) {
      throw EtaErr(
        "Bad template syntax\n\n" +
          e.message +
          "\n" +
          Array(e.message.length + 1).join("=") +
          "\n" +
          compileToString(str, options) +
          "\n", // This will put an extra newline before the callstack for extra readability
      );
    } else {
      throw e;
    }
  }
}